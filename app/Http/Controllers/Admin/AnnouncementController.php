<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AnnouncementController extends Controller
{
    public function index(): Response
    {
        // OTOMATIS HAPUS: Bersihkan pengumuman yang end_date-nya sudah lewat dari hari ini
        $expiredAnnouncements = Announcement::whereDate('end_date', '<', now())->get();
        foreach ($expiredAnnouncements as $expired) {
            if ($expired->banner_image) {
                Storage::disk('public')->delete($expired->banner_image);
            }
            $expired->delete();
        }

        return Inertia::render('Admin/Announcement/Index', [
            'announcements' => Announcement::with('creator:id,name')->latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);

        if ($request->hasFile('banner_image')) {
            $validated['banner_image'] = $request->file('banner_image')->store('announcements', 'public');
        }

        $validated['created_by'] = Auth::id();

        $announcement = Announcement::create($validated);

        AuditLogger::log('create', 'pengumuman', "Membuat pengumuman \"{$announcement->title}\".");

        return redirect()->back()->with('success', 'Pengumuman berhasil dibuat.');
    }

    public function update(Request $request, Announcement $announcement): RedirectResponse
    {
        $validated = $this->validated($request);

        if ($request->hasFile('banner_image')) {
            if ($announcement->banner_image) {
                Storage::disk('public')->delete($announcement->banner_image);
            }
            $validated['banner_image'] = $request->file('banner_image')->store('announcements', 'public');
        }

        $announcement->update($validated);

        AuditLogger::log('update', 'pengumuman', "Memperbarui pengumuman \"{$announcement->title}\".");

        return redirect()->back()->with('success', 'Pengumuman berhasil diperbarui.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $title = $announcement->title;

        if ($announcement->banner_image) {
            Storage::disk('public')->delete($announcement->banner_image);
        }

        $announcement->delete();

        AuditLogger::log('delete', 'pengumuman', "Menghapus pengumuman \"{$title}\".");

        return redirect()->back()->with('success', 'Pengumuman berhasil dihapus.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'content' => ['required', 'string'],
            'type' => ['required', 'in:info,promo,warning'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'is_active' => ['boolean'],
            'banner_image' => ['nullable', 'image', 'max:2048'],
        ]);
    }
}