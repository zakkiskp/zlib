<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::select(['id', 'no_anggota', 'username', 'name', 'email', 'role', 'avatar_url', 'status', 'created_at']);

        if ($search = $request->string('q')->trim()->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->string('role')->toString()) {
            $query->where('role', $role);
        }

        $users = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        return Inertia::render('Admin/User/Index', [
            'users' => $users,
            'filters' => $request->only(['q', 'role']),
        ]);
    }

    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,petugas,anggota',
        ]);

        $user->update($validated);

        return back()->with('success', 'Role user diperbarui.');
    }

    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => 'required|in:aktif,nonaktif',
        ]);

        $user->update($validated);

        return back()->with('success', 'Status user diperbarui.');
    }

    public function resetPassword(User $user)
    {
        $passwordBaru = 'password123';
        $user->update(['password' => Hash::make($passwordBaru)]);

        return back()->with('success', "Password direset ke: {$passwordBaru}");
    }
}
