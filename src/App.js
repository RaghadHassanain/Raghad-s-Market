import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Alert, Form, Navbar, Nav, Button } from "react-bootstrap";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchProducts();
    document.body.style.backgroundColor = "#f5f5dc"; 
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://dummyjson.com/products");
      setProducts(res.data.products);
      setError("");
    } catch (err) {
      setError("Error fetching products. Please try again later.");
    }
    setLoading(false);
  };

  const toggleSelect = (id) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((productId) => productId !== id)
        : [...prevSelected, id]
    );
  };

  const linkButtonStyle = {
    color: "purple",
    fontWeight: "bold",
    textDecoration: "none"
  };

  const filteredProducts = products
    .filter((product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      selectedCategory === "All" ? true : product.category === selectedCategory
    )
    .filter((product) => {
      const min = parseFloat(minPrice) || 0;
      const max = parseFloat(maxPrice) || Infinity;
      return product.price >= min && product.price <= max;
    })
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <>
      <Navbar expand="lg" className="mb-4" style={{ 
        background: "linear-gradient(to right, #e0bbf3, #f7f7f7)"
      }}>
        <Container>
          <Navbar.Brand
            href="#"
            style={{
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              color: "purple",
              textDecoration: "none"
            }}
          >
            Raghad's market
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Button variant="link" style={linkButtonStyle} onClick={() => setSelectedCategory("All")}>
                All
              </Button>
              <Button variant="link" style={linkButtonStyle} onClick={() => setSelectedCategory("beauty")}>
                Beauty
              </Button>
              <Button variant="link" style={linkButtonStyle} onClick={() => setSelectedCategory("fragrances")}>
                Fragrances
              </Button>
              <Button variant="link" style={linkButtonStyle} onClick={() => setSelectedCategory("furniture")}>
                Furniture
              </Button>
              <Button variant="link" style={linkButtonStyle} onClick={() => setSelectedCategory("groceries")}>
                Groceries
              </Button>
            </Nav>

            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search products..."
                className="me-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Min Price"
                className="me-2"
                style={{ width: "120px" }}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <Form.Control
                type="number"
                placeholder="Max Price"
                className="me-2"
                style={{ width: "120px" }}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <Form.Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                style={{ width: "180px" }}
              >
                <option value="">Sort By</option>
                <option value="lowToHigh">Price: Low to High</option>
                <option value="highToLow">Price: High to Low</option>
              </Form.Select>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="my-4">
        {loading && (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {error && (
          <Alert variant="danger" className="text-center">
            {error}
          </Alert>
        )}

        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredProducts.map((product) => (
            <Col key={product.id}>
              <Card
                className={`h-100 ${
                  selectedProducts.includes(product.id) ? "border border-danger" : ""
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => toggleSelect(product.id)}
              >
                <Card.Img
                  variant="top"
                  src={product.thumbnail}
                  height="200px"
                  style={{ objectFit: "cover" }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text className="mb-1">
                    <strong>Price:</strong> ${product.price}
                  </Card.Text>
                  <Card.Text className="mb-1">
                    <strong>Discount:</strong> {product.discountPercentage}%
                  </Card.Text>
                  <Card.Text>
                    <strong>Rating:</strong> {product.rating}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default App;
