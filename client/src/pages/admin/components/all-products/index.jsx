import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Spinner,
  Image,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { MdOutlineStarBorder, MdOutlineStar } from "react-icons/md";

import { useProductStore } from "../../../../store/useProductStore";
import { useEffect } from "react";
import { Edit, Trash } from "lucide-react";

const AllProducts = () => {
  const {
    getAllProducts,
    loading,
    products,
    deleteProduct,
    toggleFeaturedProduct,
  } = useProductStore();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const handleProductDelete = (id) => {
    deleteProduct(id);
    onClose();
  };

  const handleFeaturedProduct = (id) => {
    toggleFeaturedProduct(id);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Spinner />;
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-bold text-2xl mt-10 mb-4">Products</h2>

      <Table aria-label="products">
        <TableHeader>
          <TableColumn>Image</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Description</TableColumn>
          <TableColumn>Price</TableColumn>
          <TableColumn>Category</TableColumn>
          <TableColumn>Featured</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No rows to display."}>
          {products.map((product, idx) => (
            <TableRow key={idx + 1} className="justify-center">
              <TableCell>
                <Image
                  src={product.image}
                  width={150}
                  alt="image"
                  className="rounded-none"
                />
              </TableCell>
              <TableCell>
                <span className="line-clamp-2">{product.name}</span>
              </TableCell>
              <TableCell>
                <span className="line-clamp-2">{product.description}</span>
              </TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                {product.isFeatured ? (
                  <MdOutlineStar
                    className="text-yellow-500 text-2xl cursor-pointer"
                    onClick={() => handleFeaturedProduct(product._id)}
                  />
                ) : (
                  <MdOutlineStarBorder
                    className="text-2xl cursor-pointer"
                    onClick={() => handleFeaturedProduct(product._id)}
                  />
                )}
              </TableCell>
              <TableCell>
                <div className="relative flex items-center gap-2">
                  <Tooltip content="Edit">
                    <span className="text-default-400 cursor-pointer active:opacity-50">
                      <Edit className="w-5" />
                    </span>
                  </Tooltip>
                  <Tooltip content="Delete">
                    <span
                      className="text-red-600 cursor-pointer active:opacity-50"
                      onClick={onOpen}
                    >
                      <Trash className="w-5" />
                    </span>
                  </Tooltip>
                  <Modal
                    size="sm"
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    backdrop="transparent"
                  >
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className="flex flex-col gap-1">
                            Delete Product
                          </ModalHeader>
                          <ModalBody>
                            <p>Are you really wants to delete this product?</p>
                          </ModalBody>
                          <ModalFooter>
                            <Button variant="solid" onPress={onClose}>
                              Cancel
                            </Button>
                            <Button
                              color="danger"
                              onPress={() => handleProductDelete(product._id)}
                            >
                              {loading ? "Loading..." : "Delete"}
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllProducts;
