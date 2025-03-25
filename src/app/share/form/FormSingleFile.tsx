"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { message, Upload } from "antd";
import { IoIosCloseCircle } from "react-icons/io";
import clsx from "clsx";
import imageError from "../../../../public/client/assets/images/avatar.png";
import imageFile from "../../../../public/client/assets/images/avatar.png";

interface IProps {
  value?: File | File[] | string;
  onChange: (value: File | null) => void;
  id?: string;
  error?: string;
  disabled?: boolean;
}

const FormSingleFile: React.FC<IProps> = ({ value, onChange, id, disabled }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFile(value || null);
  }, [value]);

  const handleDeleteImage = () => {
    setFile(null);
    onChange(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFile = files[0];

      if (newFile.name === "error.jpg") {
        message.error("Error uploading file, please try again");
        setError("Error uploading file, please try again.");
        return;
      }

      setFile(newFile);
      onChange(newFile);
      setError(null);
    }
  };

  const renderFileIcon = (file: File | string) => {
    if (file instanceof File) {
      return file.type.startsWith("image/") ? (
        <Image
          src={URL.createObjectURL(file)}
          alt={file.name}
          width={100}
          height={100}
          className="h-[100px] w-[100px] rounded-lg object-cover"
          onError={(e) => (e.currentTarget.src = imageError.src)}
        />
      ) : (
        <Image src={imageFile} alt="File" width={100} height={100} className="h-[100px] w-[100px] rounded-lg object-cover" />
      );
    } else if (typeof file === "string") {
      return <Image src={file} alt="File" width={100} height={100} className="h-[100px] w-[100px] rounded-lg object-cover" />;
    } else {
      return null;
    }
  };

  return (
    <div className="custom-upload flex h-[235px] items-center justify-center rounded-lg bg-gray-100 px-3 py-6">
      <div className="flex-col items-center gap-4">
        <div className="flex justify-center">
          {file && (
            <div className="relative mx-2 inline-block text-center">
              {renderFileIcon(file)}
              <button onClick={handleDeleteImage} disabled={disabled}>
                <IoIosCloseCircle className={clsx("absolute right-1 top-1 h-6 w-6 text-red-500", { hidden: disabled })} />
              </button>
            </div>
          )}
        </div>
        {!file && <div className="mt-3 text-center font-normal text-gray-400">Kéo hoặc thả file vào đây</div>}
        <div className="mt-4 flex items-center gap-4 sm:flex-col md:justify-center">
          <label
            htmlFor={`file-upload-${id}`}
            className={clsx("cursor-pointer rounded bg-blue-500 px-4 py-2 text-white", { hidden: disabled })}
          >
            Tải file lên
          </label>
          <input id={`file-upload-${id}`} type="file" onChange={handleFileChange} className="hidden" disabled={disabled} />
        </div>
      </div>
      {!!error && <div className="mt-2 text-red-500">{error}</div>}
    </div>
  );
};

export default FormSingleFile;
