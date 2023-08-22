<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Article;
use Illuminate\Support\Facades\Cache;

class ArticleController extends Controller
{
    public function index()
    {
        $data = Cache::remember('article',600, function () { //600 saniyeliğime veriler cachlendi.
            return Article::get();
        });

        return response($data, 202);
    }
}
