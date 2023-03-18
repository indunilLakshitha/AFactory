<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function list()
    {
        return Inertia::render('Admin/User/List');
    }

    public function profile()
    {
        return Inertia::render('Admin/User/Profile');
    }
}
