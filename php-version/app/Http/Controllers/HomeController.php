<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class HomeController extends Controller
{
    public function index()
    {
        // Example: Fetch data from an API (e.g., Supabase or AI API)
        // $response = Http::withToken(env('LOVABLE_API_KEY'))->post('https://ai.gateway.lovable.dev/v1/chat/completions', [...]);
        // $data = $response->json();

        return view('home');
    }
}
