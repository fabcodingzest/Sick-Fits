import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';

const RemoveButton = styled.button`
  background: none;
  font-size: 3rem;
  border: 0;

  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const REMOVE_ITEM_MUTATION = gql`
  mutation REMOVE_ITEM_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveItem({ id }) {
  const [deleteItem, { loading }] = useMutation(REMOVE_ITEM_MUTATION, {
    variables: { id },
    update,
    // optimisticResponse: {
    //   deleteCartItem: {
    //     __typename: 'CartItem',
    //     id,
    //   },
    // },
  });
  return (
    <RemoveButton
      type="button"
      title="Remove this item from cart"
      disabled={loading}
      onClick={deleteItem}
    >
      &times;
    </RemoveButton>
  );
}
