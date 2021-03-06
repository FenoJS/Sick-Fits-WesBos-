import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import formatMoney from '../lib/formatMoney';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!,
    $title: String,
    $price: Int,
    $description: String,
  ) {
    updateItem(
      id: $id,
      title: $title,
      price: $price,
      description: $description,
    ) {
      id
      title
      description
      price
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  UpdateItem = async (e, UpdateItemMutation) => {
    e.preventDefault();
    console.log('Updating Item!!')
    const res = await UpdateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      },
    });
  }

  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id
        }}
      >
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>;
          if (!data.item) return <p>No Item Found For ID {this.props.id}</p>
          return (
          <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
            {(UpdateItem, { loading, error }) => (
              <Form onSubmit={e => this.UpdateItem(e, UpdateItem)}
              >
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                  <label htmlFor="title">
                    Title
                    <input
                      type="text"
                      id="title"
                      name="title"
                      placeholder="Title"
                      required
                      defaultValue={data.item.title}
                      onChange={this.handleChange}
                      />
                  </label>
                  <label htmlFor="price">
                    Price
                    <input
                      type="number"
                      id="price"
                      name="price"
                      placeholder="Price"
                      required
                      defaultValue={data.item.price}
                      onChange={this.handleChange}
                      />
                  </label>
                  <label htmlFor="description">
                    Description
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Enter A Description"
                      required
                      defaultValue={data.item.description}
                      onChange={this.handleChange}
                      />
                  </label>
                  <button type="submit">Sav{loading ? 'ing' : 'e'} Changes</button>

                </fieldset>
              </Form>
            )}
          </Mutation>
        )}}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
