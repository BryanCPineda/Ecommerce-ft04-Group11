import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard/ProductCard";
import style from "../styles/catalogue.module.scss";
import { getProducts, filterByCategory } from "../actions/products";
import { getCategories } from "../actions/categories";
import { connect } from "react-redux";
import { Container, Row, Col, Form, Alert, Card, Button, ButtonGroup } from "react-bootstrap";
import {addProductToCart as setProductToGuestCart} from '../actions/guest' ;
import SearchBar from "./SearchBar";
import { setProductToCart } from "../actions/users";

//*******************CONECTADO AL STORE DE REDUX *********************/
export function Catalogue({
  products,
  categories,
  getCategories,
  getProducts,
  filterByCategory,
  setProductToCart,
  userCart,
  setProductToGuestCart,
  guestCart,
  token,
  search,
  categoryName
}) {
  const perPage = 12;
  const [state, setState] = useState({
    products: products.rows,
    totalProducts: products.count,
    currentPage: 1,
    pages: 1,
  });

  const onPaginate = (page) => {
    setState({
      ...state,
      currentPage: page
    })
  }

  const handleSetToCart = () => {
    if(!token){
      return setProductToGuestCart;
    }
    return setProductToCart
  }

  useEffect(() => {
    getProducts({search,categoryName,page:state.currentPage});
  },[search,categoryName,getProducts,state.currentPage])

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    setState(state => {
      return {
        ...state,
        products: products.rows,
        totalProducts: products.count,
        pages: Math.ceil(products.count / perPage)
      }
    })
  }, [products, userCart]);

  function getFilterCategories(e) {
    let nombreCat = e.target.value;
    filterByCategory(nombreCat);
  }

  return (
    <Container fluid>
      <Row>
        <Col className="mb-4">
          <Card className="bg-transparent border-0">
            <Card.Body>
              <Row>
                <Col sm={4} className="my-1">
                  {categories && (
                    <Form.Control
                      onChange={getFilterCategories}
                      as="select"
                      custom
                      defaultValue={categoryName}
                    >
                      <option key={0} value="">
                        {" "}
                        Cualquier categoría{" "}
                      </option>
                      {categories.map((e, i) => {
                        return <option key={e.id}> {e.name} </option>;
                      })}
                    </Form.Control>
                  )}
                </Col>
                <Col sm={8} className="my-1">
                  <SearchBar/>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className={style.catalogue}>
        {state.products.map((product, index) => {
          return <ProductCard token={token} isGuest={!!token ? false : true} guestCart={guestCart} setToCart={handleSetToCart()} key={index} product={product} />;
        })}

        {!state.products.length && (
          <Col>
            <Alert variant="info">
              {" "}
              Lo sentimos, no encontramos productos que coincidan con la
              busqueda.{" "}
            </Alert>
          </Col>
        )}
      </Row>


      {state.pages > 1 && <Row className="justify-content-center mb-4">
        {state.pages > 0 && (
          <ButtonGroup>
            {state.currentPage > 1 ? <Button onClick={() => onPaginate(state.currentPage - 1)} variant="primary border-dark2" size="sm">«</Button> : <Button variant="primary border-dark2" disabled size="sm">«</Button>}
            {state.currentPage > 1 && <Button onClick={() => onPaginate(1)} variant="primary border-dark2" size="sm">1</Button>}
            {state.currentPage > 2 && (
              <React.Fragment>
                {state.currentPage - 2 > 1 && <Button variant="primary border-dark2" disabled>...</Button>}
                <Button variant="primary border-dark2" onClick={() => onPaginate(state.currentPage - 1)} >{state.currentPage - 1}</Button>
              </React.Fragment>
            )}
            <Button variant="dark2" disabled>{state.currentPage}</Button>
            {state.pages - state.currentPage > 1 && (
              <React.Fragment>
                <Button variant="primary border-dark2" onClick={() => onPaginate(state.currentPage + 1)} size="sm">{state.currentPage + 1}</Button>
              </React.Fragment>
            )}
            {state.currentPage + 2 < state.pages - 1 && (
              <Button variant="primary border-dark2" disabled>...</Button>
            )}
            {state.pages !== state.currentPage && <Button variant="primary border-dark2" onClick={() => onPaginate(state.pages)} size="sm">{state.pages}</Button>}
            {state.currentPage < state.pages ? <Button onClick={() => onPaginate(state.currentPage + 1)} variant="primary border-dark2" size="sm">»</Button> : <Button disabled variant="primary border-dark2" size="sm">»</Button>}

          </ButtonGroup>
        )
        }
      </Row >}
      {/* <Pagination onPaginate={handlePaginate()} total={state.totalProducts} perPage={2} state.{state.currentPage} /> */}
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    products: state.productsReducer.products,
    categories: state.categoriesReducer.categories,
    userCart: state.usersReducer.userCart,
    token: state.authReducer.token,
    user: state.authReducer.user,
    guestCart: state.guestReducer.cart,
    search: state.productsReducer.search,
    categoryName: state.productsReducer.categoryName
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getProducts: (keyword, page) => dispatch(getProducts(keyword, page)),
    filterByCategory: (value) => dispatch(filterByCategory(value)),
    getCategories: () => dispatch(getCategories()),
    setProductToCart: (productId, quantity) => dispatch(setProductToCart(productId, quantity)),
    setProductToGuestCart: (product) => dispatch(setProductToGuestCart(product))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);
