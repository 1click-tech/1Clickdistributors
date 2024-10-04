import { useMemo, useState } from "react";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import Modal from "../utills/Modal";
import { toast } from "react-toastify";
import Table from "../utills/Table";
import { AiOutlineEdit } from "react-icons/ai";

const ProductDetails = () => {
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState({});
  const [edit, setEdit] = useState(false);

  const handleAddProduct = (data) => {
    setProducts((pre) => [...pre, data]);
  };

  const editProduct = (data) => {
    const newProducts = products.map((p) => {
      if (p.name === data.name) {
        return data;
      }
      return p;
    });
    setProducts(newProducts);
    setProductData({});
    setEdit(false);
  };

  const handleEditProduct = (p) => {
    setProductData(p);
    setEdit(true);
    setVisible(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Category",
        accessor: "category",
      },
      {
        Header: "Keywords",
        accessor: "keywords",
      },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              className="bg-blue-500 text-white py-1 px-2 rounded-md flex items-center gap-2"
              onClick={() => handleEditProduct(row)}
            >
              <span>Edit</span>
              <AiOutlineEdit className="text-white text-xl" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4">
      <button
        className={`bg-colorPrimary text-white py-2 px-4 rounded-md flex items-center gap-2`}
        onClick={() => setVisible(true)}
      >
        <span>Add Product</span>
        <AiOutlinePlus className="text-white text-xl" />
      </button>

      {products.length > 0 && (
        <div className="mt-4">
          <Table columns={columns} data={products} />
        </div>
      )}

      {visible && (
        <Modal>
          <AddProduct
            onClose={() => setVisible(false)}
            handleAddProduct={handleAddProduct}
            data={productData}
            edit={edit}
            editProduct={editProduct}
          />
        </Modal>
      )}
    </div>
  );
};

const AddProduct = ({ onClose, handleAddProduct, data, edit, editProduct }) => {
  const [product, setProduct] = useState({
    name: data.name || "",
    category: data.category || "",
    keywords: data.keywords || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const addProduct = () => {
    if (!product.name || !product.category || !product.keywords) {
      toast.error("Please fill all the fields");
      return;
    }
    handleAddProduct(product);
    onClose();
    setProduct({
      name: "",
      category: "",
      keywords: "",
    });
  };

  const handleEditProduct = () => {
    editProduct(product);
    onClose();
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white md:rounded p-4 h-full w-full md:w-96 md:h-[70vh] md:mx-auto md:translate-y-1/4 overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-3 rounded bg-white hover:bg-gray-200"
        >
          <AiOutlineClose className="text-xl text-black" />
        </button>
        <div className="w-full mt-4">
          <h2 className="text-black text-xl font-semibold">Add Product</h2>
          <div className="mt-4 w-full">
            <div className="flex flex-col space-y-4">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Product Name:
                </label>
                <input
                  type="text"
                  id="productName"
                  name="name"
                  value={product.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter product name"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Category:
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={product.category}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter category"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="keywords"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Keywords:
                </label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={product.keywords}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter keywords"
                  onChange={handleChange}
                />
              </div>
              <button
                className={`w-full bg-colorPrimary text-white py-2 px-4 rounded-md flex items-center justify-center mt-10`}
                onClick={edit ? handleEditProduct : addProduct}
              >
                <span>Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
