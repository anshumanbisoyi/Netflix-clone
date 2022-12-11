import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/counter/userSlice';
import db from '../firebase';
import './PlansScreen.css';
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
    const [products, setProducts]= useState([]);
    const user= useSelector(selectUser);
    //to fetch product db data to reflect to the frontend
    useEffect(()=>{
        db.collection('products')
        .where('active','==',true)
        .get().then((querySnapshot) => {
           const products = {};
           querySnapshot.forEach(async productDoc => {
            products[productDoc.id] = productDoc.data();
            const priceSnap =await productDoc.ref.collection('prices').get();
            priceSnap.docs.forEach(price => {
                products[productDoc.id].prices = {
                    priceId: price.id,
                    priceData: price.data()
                }
            })
           });
           setProducts(products);
        });
    }, []);

    // console.log(products);

    const loadCheckout = async (priceId) => {
         const docRef = await db
         .collection('customers')
         .doc(user.uid)
         .collection('checkout_sessions')
         .add({
            price: priceId,
            success_url: window.location.origin,
            cancel_url: window.location.origin,
         }); 
         docRef.onSnapshot(async (snap) => {
            const {error, sessionId} = snap.data();

            if(error){
                //Show error to customer 
                //inspect your Cloud Firestore logs in the Firebase console
                alert(`An error occured: ${error.message}`);
            }
            if(sessionId){
                //We have a session lets redirect to checkout
                //Init Stripe

                const stripe = await loadStripe(
                  "pk_test_51MDog3SJ9a1rMUfp04rrDQyt5OEztzFZTMAYv7GB7Sja0yicFJl7SkGXrhb23WHnfjJ14SNuXspP2lEzSaOKCBTc00MWdNRRjC"
                );
                stripe.redirectToCheckout({sessionId});
            }
         });
    };

  return (
    <div className='planScreen'>
        {Object.entries(products).map(([productId, productData])=>{
            // TODO:add logic to check if user's subcription is active.
            return (
              <div className="plansScreen__plan">
                <div className="planScreen__info">
                  <h5>{productData.name}</h5>
                  <h6>{productData.description}</h6>
                </div>
                <button onClick={() => loadCheckout(productData.prices.priceId)}>Subscribe</button>
              </div>
            );
        })}
    </div>
  )
}

export default PlansScreen;