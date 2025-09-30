<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function show(Product $product)
    {
        return response()->json(['product' => $product], 200);
    }


    public function create(StoreProductRequest $request)
    { 
        $validatedData = $request->validated();

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('product_images', 'public');
        }

        $product = Product::create([
            'barcode' => $validatedData['barcode'],
            'name' => $validatedData['name'],
            'brand' => $validatedData['brand'],
            'last_price' => $validatedData['last_price'],
            'image' => $imagePath,
            'user_id' => auth()->id(),
        ]);

        return response()->json(['message' => 'product added successfully', 'product' => $product], 201);
    }
}
