export const SearchForm = () => {
    return (
        <form className="form-inline search-full" action="#" method="get">
            <div className="form-group w-100">
                <div className="Typeahead Typeahead--twitterUsers">
                    <div className="u-posRelative">
                        <input className="demo-input Typeahead-input form-control-plaintext w-100" type="text"
                               placeholder="Search Fastkart .." name="q" title="" autoFocus/>
                        <i className="close-search" data-feather="x"></i>
                        <div className="spinner-border Typeahead-spinner" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                    <div className="Typeahead-menu"></div>
                </div>
            </div>
        </form>
    )
}