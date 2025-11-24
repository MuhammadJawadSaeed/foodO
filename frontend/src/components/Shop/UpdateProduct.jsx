import React, { useEffect, useState } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";

const UpdateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [loading, setLoading] = useState(true);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    // Fetch product details
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `${server}/product/get-all-products-shop/${seller._id}`
        );
        const product = data.products.find((p) => p._id === id);

        if (product) {
          setName(product.name);
          setDescription(product.description);
          setCategory(product.category);
          setTags(product.tags || "");
          setOriginalPrice(product.originalPrice);
          setDiscountPrice(product.discountPrice);
          setExistingImages(product.images || []);
        }
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load product details");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, seller._id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Product updated successfully!");
      navigate("/dashboard-products");
      window.location.reload();
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalImages = [];

    // If new images are uploaded, use only new images
    if (images.length > 0) {
      finalImages = images;
    } else {
      // Keep existing images
      finalImages = existingImages;
    }

    dispatch(
      updateProduct(id, {
        name,
        description,
        category,
        tags,
        originalPrice,
        discountPrice,
        images: images.length > 0 ? images : undefined,
      })
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-orange-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
          <h2 className="text-white font-bold text-xl">Update Food Item</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter food item name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              cols="30"
              required
              rows="6"
              name="description"
              value={description}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter detailed product description..."
            ></textarea>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Choose a category</option>
                {categoriesData &&
                  categoriesData.map((i) => (
                    <option value={i.title} key={i.title}>
                      {i.title}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={tags}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., spicy, vegetarian..."
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Original Price
              </label>
              <input
                type="number"
                name="price"
                value={originalPrice}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Enter original price..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Discounted Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={discountPrice}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="Enter selling price..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Images
            </label>

            {/* Existing Images */}
            {existingImages.length > 0 && images.length === 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2">
                  Current Images (Click X to remove)
                </p>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.url}
                        alt={`Product ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg border-2 border-orange-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <RxCross1 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images Upload */}
            <input
              type="file"
              id="upload"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-500 transition-colors">
              <label
                htmlFor="upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <AiOutlinePlusCircle
                  size={40}
                  className="text-orange-500 mb-2"
                />
                <span className="text-sm text-gray-600">
                  {images.length > 0
                    ? "Upload more images"
                    : "Click to upload new images (optional)"}
                </span>
              </label>
              {images && images.length > 0 && (
                <div>
                  <p className="text-xs text-gray-600 mt-3 mb-2">
                    New Images (will replace existing)
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((i, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={i}
                          alt={`New ${index + 1}`}
                          className="h-24 w-24 object-cover rounded-lg border-2 border-green-400"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <RxCross1 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md"
            >
              Update Food Item
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard-products")}
              className="px-8 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
