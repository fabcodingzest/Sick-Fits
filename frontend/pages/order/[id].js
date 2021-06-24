import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import ErrorMessage from '../../components/ErrorMessage';
import OrderItemStyles from '../../components/styles/OrderItemStyles';
import OrderStyles from '../../components/styles/OrderStyles';
import FormatMoney from '../../lib/formatMoney';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        price
        quantity
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SignleOrderPage({ query }) {
  const orderId = query.id;
  const { data, error, loading } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id: orderId },
  });
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;
  const { Order } = data;
  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits | {Order.id}</title>
      </Head>
      <p>
        <span>Order Id</span>
        <span>{Order.id}</span>
      </p>
      <p>
        <span>Charge Id</span>
        <span>{Order.charge}</span>
      </p>
      <p>
        <span>Order Total</span>
        <span>{FormatMoney(Order.total)}</span>
      </p>
      <p>
        <span>Item Count</span>
        <span>{Order.items.length}</span>
      </p>
      <div className="items">
        {Order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <img src={item.photo.image.publicUrlTransformed} alt={item.title} />
            <div className="item-details">
              <h2>{item.name}</h2>
              <p>Qty: {item.quantity}</p>
              <p>Each: {FormatMoney(item.price)}</p>
              <p>Sub Total: {FormatMoney(item.price * item.quantity)}</p>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}
