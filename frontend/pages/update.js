import UpdateProduct from '../components/UpdateProduct';

export default function SellPage({ query }) {
  return (
    <div>
          <UpdateProduct id={ query.id }/>
    </div>
  );
}
