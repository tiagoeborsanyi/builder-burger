import React, { Component } from 'react'
import axios from '../../../axios-orders';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.css';

class ContactData extends Component {

    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        // alert('You continue!!');
        this.setState({loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Tiago Emerick',
                address: {
                    street: 'rua dois',
                    zipcode: '13090-145',
                    country: 'Brazil'
                },
                email: 'tiago@teste.com',
                deliveryMethod: 'fastest'
            }
        }
        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false});
                console.log(this.props);
                this.props.history.push('/');    
            })
            .catch(error => {
                this.setState({loading: false});
            });
        console.log(this.props.ingredients);
    }

    render() {
        let form = (
            <form>
                <Input inputtype="input" type="text" name="name" placeholder="Your name" />
                <Input inputtype="input" type="email" name="email" placeholder="Your email" />
                <Input inputtype="input" type="text" name="street" placeholder="street" />
                <Input inputtype="input" type="text" name="postal" placeholder="Postal Code" />
                <Button btnType="Success" clicked={this.orderHandler}>ORDER</Button>
            </form>  
        );
        if (this.state.loading) {
            form = <Spinner />;
        }
        return (
        <div className={classes.ContactData}>
            <h4>Enter your Contact Data</h4>
            {form} 
        </div>
        )
    }
}

export default ContactData;