import React, { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import axios from 'axios';

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const SeoComponent = ({ slug, data }) => {

  const [seoData, setSeoData] = useState({});

  const getSeoData = useCallback(async () => {
    const response = await axios.get(BASE_API_URL + `seo/${slug}`);
    if (response?.data?.result === true) {
      setSeoData(response?.data?.data);
    }
  }, [slug])

  useEffect(() => {
    if (slug !== "detail-page") {
      getSeoData();
    } else {
      setSeoData(data);
    }
  }, [slug, getSeoData, data]);


  const { metaTitle, metaDescription, metaKeywords } = seoData;

  return (
    <Helmet>
      {metaTitle && <title>{metaTitle}</title>}
      {metaKeywords && <meta name="keywords" content={metaKeywords} />}
      {metaDescription && <meta name="description" content={metaDescription} />}
      {metaTitle && <meta property="og:title" content={metaTitle} />}
      {metaDescription && <meta property="og:description" content={metaDescription} />}
      {metaTitle && <meta name="twitter:title" content={metaTitle} />}
      {metaDescription && <meta name="twitter:description" content={metaDescription} />}
    </Helmet>
  );
};

SeoComponent.propTypes = {
  slug: PropTypes.string.isRequired,
  data: PropTypes.object,
};
export default SeoComponent;
