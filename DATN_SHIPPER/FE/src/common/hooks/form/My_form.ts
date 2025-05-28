// import { useNavigate, useParams } from "react-router-dom";
// import { Mutation_items } from "../Products/mutation_item";
// import { Query_Detail_Products_Dashboard } from "../Products/Products";
// import { useEffect, useState } from "react";
// import { UploadGallery, UploadImage } from "../../../systems/utils/uploadImage";

// const useForm = ({ mode }: { mode?: string }) => {
//   const routing = useNavigate();
//   const [loading, setLoading] = useState<boolean>(false);
//   const { id } = useParams<{ id: string }>();
//   const [imageFile, setImageFile] = useState<any>();
//   const [galleryFiles, setGalleryFiles] = useState<string[]>([]);
//   const [old_galleryFiles, setOld_GalleryFiles] = useState<any>();
//   let data_one_item: any;
//   if (id) {
//     data_one_item = Query_Detail_Products_Dashboard(id);
//   }
//   useEffect(() => {
//     if (mode) {
//       setImageFile(data_one_item?.data?.product?.image_product);
//       setOld_GalleryFiles(data_one_item?.data?.product?.gallery_product);
//     }
//   }, [
//     mode,
//     data_one_item?.data?.product?.image_product,
//     data_one_item?.data?.product?.gallery_product,
//   ]);
//   const { mutate, isPending, isError, status_api } = Mutation_items(
//     mode ? "EDIT" : "CREATE"
//   );
//   const handleImageChange = (imageItem: any) => {
//     setImageFile(imageItem?.fileList?.map((file: any) => file.originFileObj));
//   };
//   const handleGalleryChange = ({ fileList }: any) => {
//     const old_img = fileList?.filter(
//       (item: any) => typeof item?.uid === "number"
//     );
//     setOld_GalleryFiles(old_img);
//     const a = fileList?.filter((file: any) => typeof file?.uid !== "number");
//     const b = a?.map((fileObj) => fileObj.originFileObj);
//     setGalleryFiles(b);
//     console.log(b);
//   };
//   async function onSubmit(dataForm: any) {
//     setLoading(true);
//     const imageUrl = await UploadImage(imageFile[0]);
//     const a = await UploadGallery(galleryFiles);
//     const galleryUrls = a?.map((x) => ({
//       uid: old_galleryFiles?.length,
//       name: "image.png",
//       status: "done",
//       url: x,
//     }));
//     const attributesJson =
//       dataForm?.attributes?.length > 0 && JSON.stringify(dataForm.attributes);
//     setLoading(false);
//     const finalValues = {
//       ...dataForm,
//       image_product: imageUrl,
//       gallery_product: mode ? galleryUrls : a,
//       attributes: attributesJson,
//     };
//     let dataClient = {
//       dataBody: finalValues,
//     };

//     if (mode) {
//       let a = [...old_galleryFiles];
//       if (galleryUrls) {
//         a = [...old_galleryFiles, ...galleryUrls];
//       }
//       const b = a?.map((uri) => uri?.url);
//       const data_edit = {
//         ...finalValues,
//         image_product: imageUrl,
//         gallery_product: b,
//       };
//       dataClient = {
//         dataBody: data_edit,
//         id_item: id,
//       };
//     }
//     mutate(dataClient);
//   }
//   if (status_api === "call_ok") {
//     routing("/admin/products");
//   }
//   return {
//     onSubmit,
//     isPending,
//     isError,
//     data_one_item,
//     handleImageChange,
//     handleGalleryChange,
//     loading,
//   };
// };

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
  }, [mode, dataOneItem]);

  const { mutate, isPending, isError, status_api } = Mutation_items(
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
    isPending,
    isError,
    data_one_item: dataOneItem,
    handleImageChange,
    handleGalleryChange,
    loading
  };
};

export default useForm;
