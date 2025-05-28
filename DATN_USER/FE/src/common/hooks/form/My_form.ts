/* eslint-disable @typescript-eslint/no-explicit-any */
// export default useForm;
import { useNavigate, useParams } from "react-router-dom";
import { Mutation_items } from "../Products/mutation_item";
import { Query_Detail_Products_Dashboard } from "../Products/Products";
import { useEffect, useState } from "react";
import { UploadGallery, UploadImage } from "../../../systems/utils/uploadImage";

interface UseFormProps {
  mode?: string;
}

const useForm = ({ mode }: UseFormProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<string[]>([]);
  const [oldGalleryFiles, setOldGalleryFiles] = useState<any[]>([]);

  let dataOneItem: any;

  if (id) {
    dataOneItem = Query_Detail_Products_Dashboard(id);
  }

  useEffect(() => {
    if (mode && dataOneItem) {
      const product = dataOneItem?.data?.product;
      if (product) {
        setImageFile([product?.image_product]);
        setOldGalleryFiles(product?.gallery_product);
      }
    }
  }, [mode, dataOneItem?.data?.product]);

  const { mutate, isLoading, isError, status_api } = Mutation_items(
    mode ? "EDIT" : "CREATE"
  );

  const handleImageChange = (imageItem: any) => {
    const files =
      imageItem?.fileList?.map((file: any) => file.originFileObj) || [];
    setImageFile(files);
  };

  const handleGalleryChange = ({ fileList }: any) => {
    const oldImages =
      fileList?.filter((item: any) => typeof item?.uid === "number") || [];
    setOldGalleryFiles(oldImages);

    const newFiles =
      fileList
        ?.filter((file: any) => typeof file?.uid !== "number")
        .map((fileObj: any) => fileObj.originFileObj) || [];
    setGalleryFiles(newFiles);
  };

  const onSubmit = async (dataForm: any) => {
    setLoading(true);
    try {
      const imageUrl = await UploadImage(imageFile[0]);
      const galleryUrls = await UploadGallery(galleryFiles);

      const finalGalleryUrls = galleryUrls?.map((url: string) => ({
        uid: oldGalleryFiles.length,
        name: "image.png",
        status: "done",
        url
      }));

      const attributesJson = dataForm?.attributes?.length
        ? JSON.stringify(dataForm.attributes)
        : undefined;

      setLoading(false);

      const finalValues = {
        ...dataForm,
        image_product: imageUrl,
        gallery_product: mode ? finalGalleryUrls : galleryUrls,
        attributes: attributesJson
      };

      let dataClient = {
        dataBody: finalValues
      };

      if (mode) {
        const updatedGallery = [
          ...oldGalleryFiles,
          ...(finalGalleryUrls || [])
        ];
        const galleryUrlsMapped = updatedGallery.map((uri) => uri?.url);

        const dataEdit = {
          ...finalValues,
          gallery_product: galleryUrlsMapped
        };

        dataClient = {
          dataBody: dataEdit,
          id_item: id
        };
      }

      mutate(dataClient);
    } catch (error) {
      console.error("Error during submission", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status_api === "call_ok") {
      navigate("/admin/products");
    }
  }, [status_api, navigate]);

  return {
    onSubmit,
    isLoading,
    isError,
    data_one_item: dataOneItem,
    handleImageChange,
    handleGalleryChange,
    loading
  };
};

export default useForm;
