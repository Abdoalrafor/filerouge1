<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Exercise;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->isTeacher()) {
            $lessons = Lesson::where('teacher_id', $user->id)
                ->with(['exercises'])
                ->get();
        } else {
            $lessons = Lesson::with(['teacher', 'exercises'])
                ->get();
        }

        return response()->json([
            'status' => 'success',
            'lessons' => $lessons
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user->isTeacher()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Only teachers can create lessons'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'content' => 'required|string',
            'subject' => 'required|string|max:255',
            'level' => 'required|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $lesson = Lesson::create([
            'title' => $request->title,
            'description' => $request->description,
            'content' => $request->content,
            'teacher_id' => $user->id,
            'subject' => $request->subject,
            'level' => $request->level,
            'file_path' => $request->file_path
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson created successfully',
            'lesson' => $lesson
        ], 201);
    }

    public function show($id)
    {
        $lesson = Lesson::with(['teacher', 'exercises'])->find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lesson not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'lesson' => $lesson
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lesson not found'
            ], 404);
        }

        if ($lesson->teacher_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to update this lesson'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'content' => 'sometimes|string',
            'subject' => 'sometimes|string|max:255',
            'level' => 'sometimes|string|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $lesson->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson updated successfully',
            'lesson' => $lesson
        ]);
    }

    public function destroy($id)
    {
        $user = $request->user();
        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 'error',
                'message' => 'Lesson not found'
            ], 404);
        }

        if ($lesson->teacher_id !== $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to delete this lesson'
            ], 403);
        }

        $lesson->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Lesson deleted successfully'
        ]);
    }

    public function search(Request $request)
    {
        $query = Lesson::with(['teacher', 'exercises']);

        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        if ($request->has('subject')) {
            $query->where('subject', 'like', '%' . $request->subject . '%');
        }

        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        $lessons = $query->get();

        return response()->json([
            'status' => 'success',
            'lessons' => $lessons
        ]);
    }
}