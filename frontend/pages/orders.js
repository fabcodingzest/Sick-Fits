import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import styled from 'styled-components';
import Link from 'next/link';
import ErrorMessage from '../components/ErrorMessage';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import FormatMoney from '../lib/formatMoney';

const USER_ORDER_QUERY = gql`
  query USER_ORDER_QUERY {
    allOrders {
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

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function countItemsInAnOrder(order) {
  return order.items.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {
  const { data, error, loading } = useQuery(USER_ORDER_QUERY);
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;
  const { allOrders } = data;
  return (
    <>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <h2>
        You have {allOrders.length} order{allOrders.length > 1 && 's'}!
      </h2>
      <OrderUl>
        {allOrders.map((order) => {
          const totalItems = countItemsInAnOrder(order);
          const totalProducts = order.items.length;

          return (
            <OrderItemStyles>
              <Link href={`/order/${order.id}`}>
                <a>
                  <div className="order-meta">
                    <p>
                      {totalItems} Item
                      {totalItems > 1 && 's'}
                    </p>
                    <p>
                      {totalProducts} Product{totalProducts > 1 && 's'}
                    </p>
                    <p>{FormatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.items.map((item) => (
                      <img
                        key={`image-${item.id}`}
                        src={item.photo?.image?.publicUrlTransformed}
                        alt={item.name}
                      />
                    ))}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          );
        })}
      </OrderUl>
    </>
  );
}
