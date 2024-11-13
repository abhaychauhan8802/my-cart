import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../../../store/useProductStore";

const categories = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
  "electronics",
];

const AddProduct = () => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "",
  });

  const { addProduct, loading } = useProductStore();

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addProduct(newProduct);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
    }
  };

  return (
    <div className="md:mt-14 h-full">
      <h2 className="font-bold text-2xl mb-4">Add Product</h2>

      <form className="flex flex-col gap-8" onSubmit={handleAddProduct}>
        <div>
          <label className="block mb-2">Name</label>
          <Input
            type="text"
            placeholder="Enter product name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <Input
            type="text"
            placeholder="Enter product description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2">Price</label>
          <Input
            type="number"
            placeholder="Enter product price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block mb-2">Category</label>
          <Select
            name="category"
            aria-label="category"
            placeholder="Select a category"
            value={newProduct.category}
            onChange={(e) =>
              setNewProduct({ ...newProduct, category: e.target.value })
            }
          >
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="image"
            className="sr-only"
            accept="image/*"
            onChange={handleImageChange}
          />
          <label
            htmlFor="image"
            className="cursor-pointer bg-[#e6e6e6] py-2 px-3 border border-[#e4e4e7] rounded-lg text-sm  text-gray-600 hover:bg-[#d1d1d1]"
          >
            Upload Image
          </label>
          {newProduct.image && (
            <span className="ml-3 text-sm text-gray-400 flex gap-2">
              <Check />
              Image uploaded
            </span>
          )}
        </div>

        <Button className="py-3" type="submit" color="primary">
          {loading ? "Loading..." : "Add Product"}
        </Button>
      </form>
    </div>
  );
};

export default AddProduct;
