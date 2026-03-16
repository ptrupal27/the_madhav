@extends('admin.layouts.app')

@section('content')
    <h2>Add New Product</h2>
    <div class="card p-4">
        <form action="{{ route('admin.products.store') }}" method="POST" enctype="multipart/form-data">
            @csrf

            <div class="row">
                <div class="col-md-4 mb-3">
                    <label>Name (English)</label>
                    <input type="text" name="name_en" class="form-control" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label>Name (Hindi)</label>
                    <input type="text" name="name_hi" class="form-control">
                </div>
                <div class="col-md-4 mb-3">
                    <label>Name (Gujarati)</label>
                    <input type="text" name="name_gu" class="form-control">
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label>Slug</label>
                    <input type="text" name="slug" class="form-control" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label>Category</label>
                    <select name="category_id" class="form-control" required>
                        <option value="">Select Category</option>
                        @foreach($categories as $category)
                            <option value="{{ $category->id }}">{{ $category->name['en'] ?? $category->name }}</option>
                        @endforeach
                    </select>
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label>Price</label>
                    <input type="number" step="0.01" name="price" class="form-control" required>
                </div>
                <div class="col-md-6 mb-3">
                    <label>Stock</label>
                    <input type="number" name="stock" class="form-control" value="0">
                </div>
            </div>

            <div class="mb-3">
                <label>Description (English)</label>
                <textarea name="description_en" class="form-control"></textarea>
            </div>
            <div class="mb-3">
                <label>Description (Hindi)</label>
                <textarea name="description_hi" class="form-control"></textarea>
            </div>

            <div class="mb-3">
                <label>Image</label>
                <input type="file" name="image" class="form-control">
            </div>

            <button type="submit" class="btn btn-success">Save Product</button>
        </form>
    </div>
@endsection