@extends('admin.layouts.app')

@section('content')
    <h2>Edit Product</h2>
    <div class="card p-4">
        <form action="{{ route('admin.products.update', $product->id) }}" method="POST" enctype="multipart/form-data">
            @csrf
            @method('PUT')

            <div class="row">
                <div class="col-md-4 mb-3">
                    <label>Name (English)</label>
                    <input type="text" name="name_en" class="form-control" value="{{ $product->name['en'] ?? '' }}"
                        required>
                </div>
                <div class="col-md-4 mb-3">
                    <label>Name (Hindi)</label>
                    <input type="text" name="name_hi" class="form-control" value="{{ $product->name['hi'] ?? '' }}">
                </div>
                <div class="col-md-4 mb-3">
                    <label>Name (Gujarati)</label>
                    <input type="text" name="name_gu" class="form-control" value="{{ $product->name['gu'] ?? '' }}">
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label>Slug</label>
                    <input type="text" name="slug" class="form-control" value="{{ $product->slug }}" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label>Category</label>
                    <select name="category_id" class="form-control" required>
                        <option value="">Select Category</option>
                        @foreach($categories as $category)
                            <option value="{{ $category->id }}" {{ $product->category_id == $category->id ? 'selected' : '' }}>
                                {{ $category->name['en'] ?? $category->name }}
                            </option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label>Price</label>
                    <input type="number" step="0.01" name="price" class="form-control" value="{{ $product->price }}"
                        required>
                </div>
                <div class="col-md-6 mb-3">
                    <label>Stock</label>
                    <input type="number" name="stock" class="form-control" value="{{ $product->stock }}">
                </div>
            </div>

            <div class="mb-3">
                <label>Description (English)</label>
                <textarea name="description_en" class="form-control">{{ $product->description['en'] ?? '' }}</textarea>
            </div>

            <div class="mb-3">
                <label>Image</label>
                @if($product->image)
                    <div class="mb-2"><img src="{{ asset('storage/' . $product->image) }}" width="100"></div>
                @endif
                <input type="file" name="image" class="form-control">
            </div>

            <button type="submit" class="btn btn-primary">Update Product</button>
        </form>
    </div>
@endsection