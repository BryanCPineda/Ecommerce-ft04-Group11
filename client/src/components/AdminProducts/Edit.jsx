import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { FiMaximize2, FiRotateCcw, FiTrash2, FiPlus } from 'react-icons/fi';


function Edit({ show, handleClose, product, updateProduct, allCategories }) {
        const { id, images, name, description, stock, price, categories } = product;
        const [state, setState] = useState({
                images: JSON.parse(images),
                name,
                description,
                stock,
                price,
                categories: categories.map(item => item.id),
                categoriesToDelete: []
        });

        useEffect(() => {
                setState({
                        images: JSON.parse(images),
                        name,
                        description,
                        stock,
                        price,
                        categories: categories.map(item => item.id),
                        categoriesToDelete: []
                });
        }, [product, product.categories]);

        const handleInput = (e) => {
                setState({
                        ...state,
                        [e.target.name]: e.target.value
                })
        }

        const handleCategories = (e) => {
                let options = e.target.options;
                let value = [];
                let toDelete = [];
                for (var i = 0, l = options.length; i < l; i++) {
                        if (options[i].selected) {
                                value.push(options[i].value * 1);
                        } else {
                                toDelete.push(options[i].value * 1);
                        }
                }
                setState({
                        ...state,
                        [e.target.name]: value,
                        categoriesToDelete: toDelete
                })
        }

        const addImage = () => {
                if (state.images.length < 10) {
                        setState({
                                ...state,
                                images: state.images.concat('')
                        })
                }
        }

        const updateImage = (e, index) => {
                let images = state.images;
                images[index] = e.target.value;

                setState({
                        ...state,
                        images
                })

        }

        const removeImage = (index) => {
                if (state.images.length > 1) {
                        let images = state.images;
                        images.splice(index, 1);
                        setState({
                                ...state,
                                images
                        })
                }
        }
        return (
                <Modal size="lg" show={show} onHide={handleClose}>
                        <Modal.Header className="border-0 bg-dark2" closeButton>
                                <Modal.Title>Modificar producto</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="bg-dark2">
                                <form>
                                        {/* <input type="hidden" name="iamges[]" />
                                        <Row className="overflow-auto clearfix">
                                                {JSON.parse(images).map((img, index) => (
                                                        <Col sm="3">
                                                                <Button className="position-absolute" size="sm" variant="danger" >&times;</Button>
                                                                <img className="shadow img-thumbnail m-2 img-fluid" src={img} />
                                                        </Col>
                                                ))}
                                        </Row> */}
                                        <Form.Group>
                                                <Form.Label>Nombre</Form.Label>
                                                <Form.Control onChange={handleInput} value={state.name} name="name" placeholder="Nombre" />
                                        </Form.Group>
                                        <Row>
                                                <Col>
                                                        <Form.Group>
                                                                <Form.Label>Precio</Form.Label>
                                                                <Form.Control onChange={handleInput} value={state.price * 1} type="number" name="price" step="any" placeholder="Precio" />
                                                        </Form.Group>
                                                </Col>
                                                <Col>
                                                        <Form.Group>
                                                                <Form.Label>Stock</Form.Label>
                                                                <Form.Control onChange={handleInput} value={state.stock * 1} type="number" name="stock" placeholder="Stock" />
                                                        </Form.Group>
                                                </Col>
                                        </Row>
                                        <Form.Group>
                                                <Form.Label>Categorías</Form.Label>
                                                <Form.Control as="select" multiple custom onChange={handleCategories} value={state.categories} name="categories" placeholder="Nombre">
                                                        {allCategories && allCategories.map((item, index) => (
                                                                <option key={index} value={item.id}>{item.name}</option>
                                                        ))}
                                                </Form.Control>
                                        </Form.Group>
                                        <Form.Group>
                                                <Form.Label>Descripción</Form.Label>
                                                <Form.Control as="textarea" onChange={handleInput} value={state.description} name="description" rows="5" placeholder="Descripción" />
                                        </Form.Group>
                                        <Form.Group>
                                                <Form.Label>Imágenes {state.images.length}/10</Form.Label>
                                                {state.images.map((item, index) => (
                                                        <Form.Group>
                                                                <InputGroup>
                                                                        <InputGroup.Prepend>
                                                                                <Button size="sm" variant="light"><FiMaximize2 /></Button>
                                                                        </InputGroup.Prepend>
                                                                        <Form.Control key={index} onChange={(e) => updateImage(e, index)} value={item} name="images" />
                                                                        <InputGroup.Append>
                                                                                <Button onClick={() => removeImage(index)} variant="danger" size="sm"><FiTrash2 /></Button>
                                                                                {/* <Button variant="info" size="sm"><FiRotateCcw /></Button> */}
                                                                        </InputGroup.Append>
                                                                </InputGroup>
                                                        </Form.Group>
                                                ))}
                                                {state.images.length < 10 && <Button size="sm" onClick={addImage}><FiPlus /> Añadir imagen</Button>}
                                        </Form.Group>
                                </form>
                        </Modal.Body>
                        <Modal.Footer className="border-0 bg-dark2">
                                <Button variant="secondary" onClick={handleClose}>
                                        Cancelar
              </Button>
                                <Button variant="warning" onClick={() => updateProduct()(id, state)}>
                                        Modificar
              </Button>
                        </Modal.Footer>
                </Modal >
        );
}

export default Edit;