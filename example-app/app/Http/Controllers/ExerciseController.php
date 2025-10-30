<?php

namespace App\Http\Controllers;

use App\Models\Exercise;
use App\Models\StudentPoint;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ExerciseController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->isTeacher()) {
            $exercises = Exercise::where('teacher_id', $user->id)
                ->with(['lesson'])
                ->get();
        } else {
            $exercises = Exercise::with(['teacher', 'lesson'])
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'exercises' => $exercises
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isTeacher()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only teachers can create exercises'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'lesson_id' => 'required|exists:lessons,id',
            'subject' => 'required|string|max:255',
            'level' => 'required|string|max:255',
            'points' => 'required|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $exercise = Exercise::create([
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
            'teacher_id' => $user->id,
            'lesson_id' => $request->lesson_id,
            'subject' => $request->subject,
            'level' => $request->level,
            'points' => $request->points,
            'file_path' => $request->file_path
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Exercise created successfully',
            'exercise' => $exercise
        ], 201);
    }

    public function show($id)
    {
        $exercise = Exercise::with(['teacher', 'lesson', 'studentPoints.student'])->find($id);

        if (!$exercise) {
            return response()->json([
                'status' => 'error',
                'message' => 'Exercise not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'exercise' => $exercise
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $exercise = Exercise::find($id);

        if (!$exercise) {
            return response()->json([
                'status' => 'error',
                'message' => 'Exercise not found'
            ], 404);
        }

        if ($exercise->teacher_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to update this exercise'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'content' => 'sometimes|string',
            'lesson_id' => 'sometimes|exists:lessons,id',
            'subject' => 'sometimes|string|max:255',
            'level' => 'sometimes|string|max:255',
            'points' => 'sometimes|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $exercise->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Exercise updated successfully',
            'exercise' => $exercise
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $exercise = Exercise::find($id);

        if (!$exercise) {
            return response()->json([
                'status' => 'error',
                'message' => 'Exercise not found'
            ], 404);
        }

        if ($exercise->teacher_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to delete this exercise'
            ], 403);
        }

        $exercise->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Exercise deleted successfully'
        ]);
    }

    public function assignPoints(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isTeacher()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only teachers can assign points'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:users,id',
            'exercise_id' => 'required|exists:exercises,id',
            'points_earned' => 'required|integer|min:0',
            'teacher_notes' => 'sometimes|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $studentPoint = StudentPoint::create([
            'student_id' => $request->student_id,
            'exercise_id' => $request->exercise_id,
            'points_earned' => $request->points_earned,
            'teacher_notes' => $request->teacher_notes
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Points assigned successfully',
            'student_point' => $studentPoint
        ], 201);
    }

    public function search(Request $request)
    {
        $query = Exercise::with(['teacher', 'lesson']);

        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('subject')) {
            $query->where('subject', 'like', '%' . $request->subject . '%');
        }

        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        $exercises = $query->get();

        return response()->json([
            'status' => 'success',
            'exercises' => $exercises
        ]);
    }
}