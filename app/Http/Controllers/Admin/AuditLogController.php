<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AuditLog::query()
            ->with('user:id,name,avatar_url')
            ->latest('created_at');

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('user_name', 'like', "%{$search}%")
                    ->orWhere('module', 'like', "%{$search}%");
            });
        }

        if ($action = $request->string('action')->toString()) {
            $query->where('action', $action);
        }

        if ($from = $request->date('from')) {
            $query->whereDate('created_at', '>=', $from);
        }

        if ($to = $request->date('to')) {
            $query->whereDate('created_at', '<=', $to);
        }

        $logs = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/AuditLog/Index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'action', 'from', 'to']),
            'actionOptions' => AuditLog::query()->distinct()->orderBy('action')->pluck('action'),
        ]);
    }
}
