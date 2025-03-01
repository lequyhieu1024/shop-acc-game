import React, {useState} from "react";

interface FormSearchProps {
    onSearch: ( nameSearch: string | null, size: number | null ) => void
}
export const FormSearch: React.FC<FormSearchProps> = ({ onSearch }) => {
    const [searchInput, setSearchInput] = useState({nameSearch: "", size: 20})

    const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        e.preventDefault();
        setSearchInput({...searchInput, [e.target.name]: e.target.value});
    }
    const handleSearch = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(searchInput.nameSearch, searchInput.size);
    }
    const handleReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setSearchInput(() => {
            const resetValue = { nameSearch: "", size: 20 };
            onSearch(resetValue.nameSearch, resetValue.size);
            return resetValue;
        });
    }
    return (
        <form className="d-flex gap-1 mb-2" onSubmit={handleSearch}>
            <div className="name_filter">
                <input type="search" className="form-control" name="nameSearch" value={searchInput.nameSearch}
                       onChange={handleSearchInput}
                       placeholder="Nội dung tìm kiếm ..."/>
            </div>
            <div className="size_filter">
                <select name="size" className="form-select form-control" value={searchInput.size} onChange={handleSearchInput}>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="500">500</option>
                </select>
            </div>
            <button type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
            <button type="button" onClick={handleReset} className="btn btn-info"><i className="fa fa-history"></i></button>
        </form>
    )
}