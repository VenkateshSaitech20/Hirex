import { useEffect, useState, useCallback, useMemo } from "react";
import PropTypes from 'prop-types';

const FindDuplicate = ({ searchName, slugs, message, setDuplicateFound, flag }) => {
    const [found, setFound] = useState(false);

    const findDuplicate = useCallback((searchName, memoizedSlugs) => {
        let name = searchName;
        let find_slug;
        if(flag === "slug") {
            let slug_name = name?.toLowerCase().replace(/[^a-zA-Z0-9]+/g, "-");
            let slug = slug_name.replace(/(^-+|-+$)/g, '');
            find_slug = memoizedSlugs.includes(slug);
        } else if (flag === "email") {
            find_slug = memoizedSlugs.includes(name);
        }
        if (find_slug) {
            setFound(true);
            setDuplicateFound(true);
        } else {
            setFound(false);
            setDuplicateFound(false);
        }
    }, [setDuplicateFound,flag]);

    const memoizedSlugs = useMemo(() => slugs, [slugs]);

    useEffect(() => {
        findDuplicate(searchName, memoizedSlugs);
    }, [searchName, memoizedSlugs, findDuplicate]);

    return (
        <>
            {found && <span className="text-danger">{message}</span>}
        </>
    );
};

FindDuplicate.propTypes = {
    searchName : PropTypes.string,
    slugs : PropTypes.array,
    setDuplicateFound : PropTypes.any,
    message : PropTypes.string,
    flag : PropTypes.string,
}

export default FindDuplicate;