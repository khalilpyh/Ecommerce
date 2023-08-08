import React, { useState } from "react";
import { client, urlFor } from "../../lib/client";
import { useStateContext } from "../../context/StateContext";
import { Product } from "../../components";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";

const ProductDetails = ({ product, products }) => {
  //destructuring product obj
  const { image, name, details, price } = product;
  const { decreaseQty, increaseQty, qty, addToCart, setShowCart } =
    useStateContext();

  //hooks
  const [index, setIndex] = useState(0);

  const clickToBuyNow = () => {
    //add item to cart and display cart
    addToCart(product, qty);
    setShowCart(true);
  };

  return (
    <div>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image.length > 1 ? image[index] : image[0])} //make sure image load correctly if product only has one image
              className="product-detail-image"
            />
          </div>
          <div className="small-images-container">
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className="price">${price}</p>
          <div className="quantity">
            <h3>Quantity:</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decreaseQty}>
                <AiOutlineMinus />
              </span>
              <span className="num">{qty}</span>
              <span className="plus" onClick={increaseQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => addToCart(product, qty)}
            >
              Add to Cart
            </button>
            <button type="button" className="buy-now" onClick={clickToBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
      slug {
        current
      }
    }
    `;

  const products = await client.fetch(query);

  const paths = products.map((product) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  //get the product base on the slug retrieved from url
  const productQuery = `*[_type == "product" && slug.current == '${slug}'][0]`;
  //get all products from database except the current product
  const moreProductsQuery = `*[_type == "product" && slug.current != '${slug}']`;

  const product = await client.fetch(productQuery);
  const products = await client.fetch(moreProductsQuery);

  return {
    props: { product, products },
  };
};

export default ProductDetails;
