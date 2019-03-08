import React, { Component } from 'react';
import { Button, Table, Row, Col, Container } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { checkPropTypes } from 'prop-types';
import Axios from 'axios';

class Cart extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      logState: true
    };
    this.newOrder = this.newOrder.bind(this);
  }

  setRedirect() {
    this.setState({
      redirect: true
    });
  }

  newOrder() {
    const { cartRow, cart, cartReset , products, loggedInUser } = this.props;
    const order = [];
    for (let key in cart) {
      products.forEach(element => {
        if (element._id === key) {
          order.push(Object.assign(element, { quantity: cart[key] }))
        }
      });
    }
    if (loggedInUser === false) {
      this.setState({logState: false});
      return;
    } else {
      Axios({
        method: 'post', // verbo http
        url: 'http://localhost:8080/orders', // url
        data: Object.assign({}, { products: order }, { userId: loggedInUser._id })
      })
        .then((response) => {
          cartReset();
          this.setRedirect();
        })
        .catch((err) => {
          throw err;
        });
    }
  }

  render() {
    const { cartRow, cart, total, products, loggedInUser, updateMessage } = this.props
    const totalArr = Object.values(total);
    let subtotal = 0;
    if (!this.state.logState) {
      updateMessage('Login is required to checkout')
      return <Redirect to="/login" />;
    }
    if (this.state.redirect) {
      return <Redirect to="/" />
    }
    if (totalArr.length > 0) {
      subtotal = Object.values(total)
        .reduce((acc, cur) => (acc += cur))
        .toFixed(2);
      return (
        <div className="cart">
          <Row>
            <Col>
              <Table responsive>
                <thead className="class-header">
                  <tr>
                    <td>Product</td>
                    <td />
                    <td>Price</td>
                    <td>Quantity</td>
                    <td>Total</td>
                    <td />
                  </tr>
                </thead>
                <tbody>{cartRow()}</tbody>
              </Table>
              <Link to="/products"><button type="button" className="btn btn-lg ButtonKeep">Keep Buying</button></Link>
            </Col>
            <Col md="5">
              <Table responsive>
                <thead className="class-header">
                  <tr>
                    <td className="subtotal">Subtotal</td>
                    <td />
                    <td />
                    <td>${subtotal}</td>
                  </tr>
                </thead>
                <tbody className="containerCol">
                  <button type="button" className="btn btn lightblue btn-lg btn-block" onClick={this.newOrder}> Proceed to checkout</button>
                </tbody>
              </Table>
            </Col>
          </Row>
          <div className="fillin0" />
        </div>
      );
    }
    return (
      <div className="fillin">
        <div className="containerCol paddinTop">
          <div> Your Shopping Cart is empty.</div>
          <br />
          <br />
          <div className="material-icons"> add_shopping_cart </div>
        </div>
      </div>
    );
  }
}

export default Cart;
