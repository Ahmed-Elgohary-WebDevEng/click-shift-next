import { ImageTypes } from "@/types/global";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { error } from "@/components/alert";
import { useUploadImage } from "@/hook/use-upload-image";

type Children = (props: {
  handleClick: () => void;
  isLoading: boolean;
  preview?: string;
  handleDelete: () => void;
}) => React.ReactNode;

interface ImageUploadProps {
  onChange: (image: string) => void;
  type: ImageTypes;
  children: Children;
  previous?: string;
}

export const ImageUpload = ({ onChange, type, children, previous }: ImageUploadProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isLoading } = useUploadImage();
  const [preview, setPreview] = useState(previous);

  const handleClick = () => inputRef.current?.click();

  const handleUpload: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { files } = e.target;

    if (files?.length) {
      const imagesForm = new FormData();

      [...files].forEach((file) => {
        if (file) {
          setPreview(URL.createObjectURL(file));
          imagesForm.append("image", file, file.name);
        }
      });
      imagesForm.append("type", type);
      mutate(imagesForm, {
        onSuccess: (res) => {
          console.log(res);
          onChange(res.data.title);
          setPreview(res.data.title);
        },
        onError: () => {
          error(t("failed.to.upload"));
        },
      });
    }
  };

  const handleDelete = () => {
    setPreview(undefined);
    onChange("");
  };

  return (
    <>
      <input
        ref={inputRef}
        onChange={handleUpload}
        type="file"
        accept="image/png, image/jpg, image/jpeg, image/webp"
        hidden
      />
      {children({ handleClick, isLoading, preview, handleDelete })}
    </>
  );
};
