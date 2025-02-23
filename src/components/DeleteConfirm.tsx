import Swal from "sweetalert2";

interface DeleteConfirmProps {
    onConfirm: () => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ onConfirm }) => {
    const showConfirm = () => {
        Swal.fire({
            title: "Chắc chắn muốn xóa?",
            text: "Sau khi xóa sẽ không thể khôi phục nó !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đúng, Xóa nó!",
            cancelButtonText: "Hủy bỏ"
        }).then((result) => {
            if (result.isConfirmed) {
                onConfirm();
            }
        });
    };

    return (
        <a onClick={showConfirm}>
            <i className="ri-delete-bin-line"></i>
        </a>
    );
};

export default DeleteConfirm;
