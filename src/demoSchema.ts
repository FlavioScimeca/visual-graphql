export const demoSchema = {
  __schema: {
    queryType: { name: "Query" },
    mutationType: { name: "Mutation" },
    subscriptionType: { name: "Subscription" },
    types: [
      // Built-in scalar types - these must be defined for GraphQL
      {
        kind: "SCALAR",
        name: "ID",
        description: "The `ID` scalar type represents a unique identifier"
      },
      {
        kind: "SCALAR",
        name: "String",
        description: "The `String` scalar type represents textual data"
      },
      {
        kind: "SCALAR",
        name: "Int",
        description: "The `Int` scalar type represents non-fractional signed whole numeric values"
      },
      {
        kind: "SCALAR",
        name: "Float",
        description: "The `Float` scalar type represents signed double-precision fractional values"
      },
      {
        kind: "SCALAR",
        name: "Boolean",
        description: "The `Boolean` scalar type represents `true` or `false`"
      },
      // Custom scalar types
      {
        kind: "SCALAR",
        name: "DateTime",
        description: "A date-time string in ISO 8601 format"
      },
      {
        kind: "SCALAR",
        name: "URL",
        description: "A URL string"
      },
      {
        kind: "OBJECT",
        name: "Query",
        description: "Root query type for the E-Commerce API",
        fields: [
          {
            name: "user",
            description: "Get a user by ID",
            args: [
              {
                name: "id",
                description: "The ID of the user",
                type: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "SCALAR",
                    name: "ID",
                    ofType: null
                  }
                }
              }
            ],
            type: {
              kind: "OBJECT",
              name: "User",
              ofType: null
            }
          },
          {
            name: "users",
            description: "Get all users with pagination",
            args: [
              {
                name: "limit",
                description: "Maximum number of users to return",
                type: {
                  kind: "SCALAR",
                  name: "Int",
                  ofType: null
                }
              },
              {
                name: "offset",
                description: "Number of users to skip",
                type: {
                  kind: "SCALAR",
                  name: "Int",
                  ofType: null
                }
              }
            ],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "UserConnection",
                ofType: null
              }
            }
          },
          {
            name: "product",
            description: "Get a product by ID",
            args: [
              {
                name: "id",
                description: "The ID of the product",
                type: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "SCALAR",
                    name: "ID",
                    ofType: null
                  }
                }
              }
            ],
            type: {
              kind: "OBJECT",
              name: "Product",
              ofType: null
            }
          },
          {
            name: "products",
            description: "Get all products with filters",
            args: [
              {
                name: "filter",
                description: "Filter criteria for products",
                type: {
                  kind: "INPUT_OBJECT",
                  name: "ProductFilterInput",
                  ofType: null
                }
              },
              {
                name: "limit",
                description: "Maximum number of products to return",
                type: {
                  kind: "SCALAR",
                  name: "Int",
                  ofType: null
                }
              }
            ],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "ProductConnection",
                ofType: null
              }
            }
          },
          {
            name: "order",
            description: "Get an order by ID",
            args: [
              {
                name: "id",
                description: "The ID of the order",
                type: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "SCALAR",
                    name: "ID",
                    ofType: null
                  }
                }
              }
            ],
            type: {
              kind: "OBJECT",
              name: "Order",
              ofType: null
            }
          },
          {
            name: "search",
            description: "Search across multiple entity types",
            args: [
              {
                name: "query",
                description: "The search query",
                type: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "SCALAR",
                    name: "String",
                    ofType: null
                  }
                }
              }
            ],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "UNION",
                  name: "SearchResult",
                  ofType: null
                }
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "Mutation",
        description: "Root mutation type for modifying data",
        fields: [
          {
            name: "createUser",
            description: "Create a new user",
            args: [
              {
                name: "input",
                description: "User creation input",
                type: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "INPUT_OBJECT",
                    name: "CreateUserInput",
                    ofType: null
                  }
                }
              }
            ],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "UserPayload",
                ofType: null
              }
            }
          },
          {
            name: "updateUser",
            description: "Update an existing user",
            args: [
              {
                name: "id",
                description: "ID of the user to update",
                type: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "SCALAR",
                    name: "ID",
                    ofType: null
                  }
                }
              },
              {
                name: "input",
                description: "User update input",
                type: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "INPUT_OBJECT",
                    name: "UpdateUserInput",
                    ofType: null
                  }
                }
              }
            ],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "UserPayload",
                ofType: null
              }
            }
          },
          {
            name: "createProduct",
            description: "Create a new product",
            args: [
              {
                name: "input",
                description: "Product creation input",
                type: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "INPUT_OBJECT",
                    name: "CreateProductInput",
                    ofType: null
                  }
                }
              }
            ],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "ProductPayload",
                ofType: null
              }
            }
          },
          {
            name: "createOrder",
            description: "Create a new order",
            args: [
              {
                name: "input",
                description: "Order creation input",
                type: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "INPUT_OBJECT",
                    name: "CreateOrderInput",
                    ofType: null
                  }
                }
              }
            ],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "OrderPayload",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "Subscription",
        description: "Root subscription type for real-time data",
        fields: [
          {
            name: "orderUpdated",
            description: "Subscribe to order updates",
            args: [
              {
                name: "orderId",
                description: "ID of the order to subscribe to",
                type: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "SCALAR",
                    name: "ID",
                    ofType: null
                  }
                }
              }
            ],
            type: {
              kind: "OBJECT",
              name: "Order",
              ofType: null
            }
          },
          {
            name: "newProduct",
            description: "Subscribe to new product notifications",
            args: [
              {
                name: "categoryId",
                description: "Optional category to filter by",
                type: {
                  kind: "SCALAR",
                  name: "ID",
                  ofType: null
                }
              }
            ],
            type: {
              kind: "OBJECT",
              name: "Product",
              ofType: null
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "INTERFACE",
        name: "Node",
        description: "An object with an ID",
        fields: [
          {
            name: "id",
            description: "The ID of the object",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          }
        ],
        interfaces: [],
        possibleTypes: [
          {
            kind: "OBJECT",
            name: "User",
            ofType: null
          },
          {
            kind: "OBJECT",
            name: "Product",
            ofType: null
          },
          {
            kind: "OBJECT",
            name: "Order",
            ofType: null
          },
          {
            kind: "OBJECT",
            name: "Review",
            ofType: null
          },
          {
            kind: "OBJECT",
            name: "Category",
            ofType: null
          }
        ]
      },
      {
        kind: "INTERFACE",
        name: "Timestamped",
        description: "An object with creation and update timestamps",
        fields: [
          {
            name: "createdAt",
            description: "When the object was created",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          },
          {
            name: "updatedAt",
            description: "When the object was last updated",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          }
        ],
        interfaces: [],
        possibleTypes: [
          {
            kind: "OBJECT",
            name: "User",
            ofType: null
          },
          {
            kind: "OBJECT",
            name: "Product",
            ofType: null
          },
          {
            kind: "OBJECT",
            name: "Order",
            ofType: null
          },
          {
            kind: "OBJECT",
            name: "Review",
            ofType: null
          }
        ]
      },
      {
        kind: "OBJECT",
        name: "User",
        description: "A user in the e-commerce system",
        fields: [
          {
            name: "id",
            description: "The ID of the user",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "name",
            description: "The full name of the user",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "email",
            description: "The email of the user",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "phone",
            description: "The phone number of the user",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "role",
            description: "The role of the user",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "ENUM",
                name: "UserRole",
                ofType: null
              }
            }
          },
          {
            name: "orders",
            description: "Orders placed by the user",
            args: [
              {
                name: "status",
                description: "Filter orders by status",
                type: {
                  kind: "ENUM",
                  name: "OrderStatus",
                  ofType: null
                }
              },
              {
                name: "limit",
                description: "Maximum number of orders to return",
                type: {
                  kind: "SCALAR",
                  name: "Int",
                  ofType: null
                }
              }
            ],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "Order",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "reviews",
            description: "Reviews written by the user",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "Review",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "cart",
            description: "The user's shopping cart",
            args: [],
            type: {
              kind: "OBJECT",
              name: "Cart",
              ofType: null
            }
          },
          {
            name: "wishlist",
            description: "The user's wishlist",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "Product",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "createdAt",
            description: "When the user was created",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          },
          {
            name: "updatedAt",
            description: "When the user was last updated",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          }
        ],
        interfaces: [
          {
            kind: "INTERFACE",
            name: "Node",
            ofType: null
          },
          {
            kind: "INTERFACE",
            name: "Timestamped",
            ofType: null
          }
        ]
      },
      {
        kind: "OBJECT",
        name: "UserConnection",
        description: "A connection to a list of users",
        fields: [
          {
            name: "edges",
            description: "A list of user edges",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "UserEdge",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "pageInfo",
            description: "Information to aid in pagination",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "PageInfo",
                ofType: null
              }
            }
          },
          {
            name: "totalCount",
            description: "The total number of users",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "UserEdge",
        description: "An edge in a connection to a user",
        fields: [
          {
            name: "node",
            description: "The user at the end of the edge",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "User",
                ofType: null
              }
            }
          },
          {
            name: "cursor",
            description: "A cursor for pagination",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "PageInfo",
        description: "Information about pagination in a connection",
        fields: [
          {
            name: "hasNextPage",
            description: "When paginating forwards, are there more items?",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Boolean",
                ofType: null
              }
            }
          },
          {
            name: "hasPreviousPage",
            description: "When paginating backwards, are there more items?",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Boolean",
                ofType: null
              }
            }
          },
          {
            name: "startCursor",
            description: "When paginating backwards, the cursor to continue",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "endCursor",
            description: "When paginating forwards, the cursor to continue",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "Product",
        description: "A product in the e-commerce system",
        fields: [
          {
            name: "id",
            description: "The ID of the product",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "name",
            description: "The name of the product",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "description",
            description: "The description of the product",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "price",
            description: "The price of the product",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Float",
                ofType: null
              }
            }
          },
          {
            name: "salePrice",
            description: "The sale price of the product, if on sale",
            args: [],
            type: {
              kind: "SCALAR",
              name: "Float",
              ofType: null
            }
          },
          {
            name: "category",
            description: "The category of the product",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "Category",
                ofType: null
              }
            }
          },
          {
            name: "tags",
            description: "Tags associated with the product",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "SCALAR",
                    name: "String",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "images",
            description: "Images of the product",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "Image",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "inventory",
            description: "The inventory details of the product",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "Inventory",
                ofType: null
              }
            }
          },
          {
            name: "reviews",
            description: "Reviews of the product",
            args: [
              {
                name: "limit",
                description: "Maximum number of reviews to return",
                type: {
                  kind: "SCALAR",
                  name: "Int",
                  ofType: null
                }
              }
            ],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "Review",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "averageRating",
            description: "The average rating of the product",
            args: [],
            type: {
              kind: "SCALAR",
              name: "Float",
              ofType: null
            }
          },
          {
            name: "relatedProducts",
            description: "Related products",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "Product",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "createdAt",
            description: "When the product was created",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          },
          {
            name: "updatedAt",
            description: "When the product was last updated",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          }
        ],
        interfaces: [
          {
            kind: "INTERFACE",
            name: "Node",
            ofType: null
          },
          {
            kind: "INTERFACE",
            name: "Timestamped",
            ofType: null
          }
        ]
      },
      {
        kind: "OBJECT",
        name: "ProductConnection",
        description: "A connection to a list of products",
        fields: [
          {
            name: "edges",
            description: "A list of product edges",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "ProductEdge",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "pageInfo",
            description: "Information to aid in pagination",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "PageInfo",
                ofType: null
              }
            }
          },
          {
            name: "totalCount",
            description: "The total number of products",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "ProductEdge",
        description: "An edge in a connection to a product",
        fields: [
          {
            name: "node",
            description: "The product at the end of the edge",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "Product",
                ofType: null
              }
            }
          },
          {
            name: "cursor",
            description: "A cursor for pagination",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "Category",
        description: "A product category",
        fields: [
          {
            name: "id",
            description: "The ID of the category",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "name",
            description: "The name of the category",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "description",
            description: "The description of the category",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "parent",
            description: "The parent category, if any",
            args: [],
            type: {
              kind: "OBJECT",
              name: "Category",
              ofType: null
            }
          },
          {
            name: "children",
            description: "Child categories",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "Category",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "products",
            description: "Products in this category",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "Product",
                    ofType: null
                  }
                }
              }
            }
          }
        ],
        interfaces: [
          {
            kind: "INTERFACE",
            name: "Node",
            ofType: null
          }
        ]
      },
      {
        kind: "OBJECT",
        name: "Order",
        description: "An order in the e-commerce system",
        fields: [
          {
            name: "id",
            description: "The ID of the order",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "orderNumber",
            description: "The order number (human-readable)",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "user",
            description: "The user who placed the order",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "User",
                ofType: null
              }
            }
          },
          {
            name: "items",
            description: "The items in the order",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "OrderItem",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "status",
            description: "The status of the order",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "ENUM",
                name: "OrderStatus",
                ofType: null
              }
            }
          },
          {
            name: "subtotal",
            description: "The subtotal of the order (before tax/shipping)",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Float",
                ofType: null
              }
            }
          },
          {
            name: "tax",
            description: "The tax amount of the order",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Float",
                ofType: null
              }
            }
          },
          {
            name: "shipping",
            description: "The shipping amount of the order",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Float",
                ofType: null
              }
            }
          },
          {
            name: "total",
            description: "The total amount of the order",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Float",
                ofType: null
              }
            }
          },
          {
            name: "shippingAddress",
            description: "The shipping address for the order",
            args: [],
            type: {
              kind: "OBJECT",
              name: "Address",
              ofType: null
            }
          },
          {
            name: "billingAddress",
            description: "The billing address for the order",
            args: [],
            type: {
              kind: "OBJECT",
              name: "Address",
              ofType: null
            }
          },
          {
            name: "paymentMethod",
            description: "The payment method used for the order",
            args: [],
            type: {
              kind: "OBJECT",
              name: "PaymentMethod",
              ofType: null
            }
          },
          {
            name: "notes",
            description: "Notes for the order",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "createdAt",
            description: "When the order was created",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          },
          {
            name: "updatedAt",
            description: "When the order was last updated",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          }
        ],
        interfaces: [
          {
            kind: "INTERFACE",
            name: "Node",
            ofType: null
          },
          {
            kind: "INTERFACE",
            name: "Timestamped",
            ofType: null
          }
        ]
      },
      {
        kind: "OBJECT",
        name: "OrderItem",
        description: "An item in an order",
        fields: [
          {
            name: "id",
            description: "The ID of the order item",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "product",
            description: "The product ordered",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "Product",
                ofType: null
              }
            }
          },
          {
            name: "quantity",
            description: "The quantity of the product",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          },
          {
            name: "price",
            description: "The price of the product at time of order",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Float",
                ofType: null
              }
            }
          },
          {
            name: "subtotal",
            description: "The subtotal for this item (price × quantity)",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Float",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "INPUT_OBJECT",
        name: "ProductFilterInput",
        description: "Filter criteria for products",
        inputFields: [
          {
            name: "categories",
            description: "Filter by categories",
            type: {
              kind: "LIST",
              name: null,
              ofType: {
                kind: "NON_NULL",
                name: null,
                ofType: {
                  kind: "SCALAR",
                  name: "ID",
                  ofType: null
                }
              }
            }
          },
          {
            name: "minPrice",
            description: "Minimum price",
            type: {
              kind: "SCALAR",
              name: "Float",
              ofType: null
            }
          },
          {
            name: "maxPrice",
            description: "Maximum price",
            type: {
              kind: "SCALAR",
              name: "Float",
              ofType: null
            }
          },
          {
            name: "search",
            description: "Search term",
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "onSale",
            description: "Only products on sale",
            type: {
              kind: "SCALAR",
              name: "Boolean",
              ofType: null
            }
          }
        ]
      },
      {
        kind: "INPUT_OBJECT",
        name: "CreateUserInput",
        description: "Input for creating a user",
        inputFields: [
          {
            name: "name",
            description: "The name of the user",
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "email",
            description: "The email of the user",
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "phone",
            description: "The phone number of the user",
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          }
        ]
      },
      {
        kind: "INPUT_OBJECT",
        name: "UpdateUserInput",
        description: "Input for updating a user",
        inputFields: [
          {
            name: "name",
            description: "The name of the user",
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "email",
            description: "The email of the user",
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "phone",
            description: "The phone number of the user",
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          }
        ]
      },
      {
        kind: "INPUT_OBJECT",
        name: "CreateProductInput",
        description: "Input for creating a product",
        inputFields: [
          {
            name: "name",
            description: "The name of the product",
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "description",
            description: "The description of the product",
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "price",
            description: "The price of the product",
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Float",
                ofType: null
              }
            }
          },
          {
            name: "categoryId",
            description: "The ID of the category",
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          }
        ]
      },
      {
        kind: "INPUT_OBJECT",
        name: "CreateOrderInput",
        description: "Input for creating an order",
        inputFields: [
          {
            name: "items",
            description: "The items in the order",
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "INPUT_OBJECT",
                    name: "OrderItemInput",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "shippingAddressId",
            description: "The ID of the shipping address",
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "billingAddressId",
            description: "The ID of the billing address",
            type: {
              kind: "SCALAR",
              name: "ID",
              ofType: null
            }
          },
          {
            name: "paymentMethodId",
            description: "The ID of the payment method",
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          }
        ]
      },
      {
        kind: "INPUT_OBJECT",
        name: "OrderItemInput",
        description: "Input for an order item",
        inputFields: [
          {
            name: "productId",
            description: "The ID of the product",
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "quantity",
            description: "The quantity of the product",
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          }
        ]
      },
      {
        kind: "OBJECT",
        name: "UserPayload",
        description: "Payload for user operations",
        fields: [
          {
            name: "user",
            description: "The user",
            args: [],
            type: {
              kind: "OBJECT",
              name: "User",
              ofType: null
            }
          },
          {
            name: "errors",
            description: "Errors, if any",
            args: [],
            type: {
              kind: "LIST",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "Error",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "ProductPayload",
        description: "Payload for product operations",
        fields: [
          {
            name: "product",
            description: "The product",
            args: [],
            type: {
              kind: "OBJECT",
              name: "Product",
              ofType: null
            }
          },
          {
            name: "errors",
            description: "Errors, if any",
            args: [],
            type: {
              kind: "LIST",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "Error",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "OrderPayload",
        description: "Payload for order operations",
        fields: [
          {
            name: "order",
            description: "The order",
            args: [],
            type: {
              kind: "OBJECT",
              name: "Order",
              ofType: null
            }
          },
          {
            name: "errors",
            description: "Errors, if any",
            args: [],
            type: {
              kind: "LIST",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "Error",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "Error",
        description: "An error",
        fields: [
          {
            name: "code",
            description: "The error code",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "message",
            description: "The error message",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "path",
            description: "The field path that caused the error",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "Image",
        description: "An image",
        fields: [
          {
            name: "id",
            description: "The ID of the image",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "url",
            description: "The URL of the image",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "URL",
                ofType: null
              }
            }
          },
          {
            name: "alt",
            description: "The alt text of the image",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "width",
            description: "The width of the image in pixels",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          },
          {
            name: "height",
            description: "The height of the image in pixels",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "Inventory",
        description: "Inventory details for a product",
        fields: [
          {
            name: "quantity",
            description: "The quantity in stock",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          },
          {
            name: "inStock",
            description: "Whether the product is in stock",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Boolean",
                ofType: null
              }
            }
          },
          {
            name: "lowStock",
            description: "Whether the product is low in stock",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Boolean",
                ofType: null
              }
            }
          },
          {
            name: "reservedQuantity",
            description: "The quantity reserved for orders",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          },
          {
            name: "availableForSale",
            description: "The quantity available for sale",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "Address",
        description: "A shipping or billing address",
        fields: [
          {
            name: "id",
            description: "The ID of the address",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "name",
            description: "The name of the addressee",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "line1",
            description: "The first line of the address",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "line2",
            description: "The second line of the address",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "city",
            description: "The city",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "state",
            description: "The state or province",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "postalCode",
            description: "The postal code",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "country",
            description: "The country",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "phone",
            description: "The phone number",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          }
        ],
        interfaces: [
          {
            kind: "INTERFACE",
            name: "Node",
            ofType: null
          }
        ]
      },
      {
        kind: "OBJECT",
        name: "PaymentMethod",
        description: "A payment method",
        fields: [
          {
            name: "id",
            description: "The ID of the payment method",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "type",
            description: "The type of the payment method",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "ENUM",
                name: "PaymentMethodType",
                ofType: null
              }
            }
          },
          {
            name: "name",
            description: "The name of the payment method",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "lastFour",
            description: "The last four digits of the card number",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "expiryMonth",
            description: "The expiry month of the card",
            args: [],
            type: {
              kind: "SCALAR",
              name: "Int",
              ofType: null
            }
          },
          {
            name: "expiryYear",
            description: "The expiry year of the card",
            args: [],
            type: {
              kind: "SCALAR",
              name: "Int",
              ofType: null
            }
          }
        ],
        interfaces: [
          {
            kind: "INTERFACE",
            name: "Node",
            ofType: null
          }
        ]
      },
      {
        kind: "ENUM",
        name: "PaymentMethodType",
        description: "Types of payment methods",
        enumValues: [
          {
            name: "CREDIT_CARD",
            description: "Credit card"
          },
          {
            name: "DEBIT_CARD",
            description: "Debit card"
          },
          {
            name: "PAYPAL",
            description: "PayPal"
          },
          {
            name: "APPLE_PAY",
            description: "Apple Pay"
          },
          {
            name: "GOOGLE_PAY",
            description: "Google Pay"
          }
        ]
      },
      {
        kind: "ENUM",
        name: "ProductCategory",
        description: "Categories for products",
        enumValues: [
          {
            name: "ELECTRONICS",
            description: "Electronic products"
          },
          {
            name: "CLOTHING",
            description: "Clothing products"
          },
          {
            name: "FOOD",
            description: "Food products"
          }
        ]
      },
      {
        kind: "ENUM",
        name: "UserRole",
        description: "Roles that a user can have",
        enumValues: [
          {
            name: "CUSTOMER",
            description: "Regular customer"
          },
          {
            name: "ADMIN",
            description: "Administrator with full access"
          },
          {
            name: "STAFF",
            description: "Staff member with limited access"
          }
        ]
      },
      {
        kind: "ENUM",
        name: "OrderStatus",
        description: "Status of an order",
        enumValues: [
          {
            name: "PENDING",
            description: "Order has been placed but not processed"
          },
          {
            name: "PROCESSING",
            description: "Order is being processed"
          },
          {
            name: "SHIPPED",
            description: "Order has been shipped"
          },
          {
            name: "DELIVERED",
            description: "Order has been delivered"
          },
          {
            name: "CANCELLED",
            description: "Order has been cancelled"
          },
          {
            name: "REFUNDED",
            description: "Order has been refunded"
          }
        ]
      },
      {
        kind: "OBJECT",
        name: "Review",
        description: "A product review",
        fields: [
          {
            name: "id",
            description: "The ID of the review",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "product",
            description: "The product being reviewed",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "Product",
                ofType: null
              }
            }
          },
          {
            name: "user",
            description: "The user who wrote the review",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "User",
                ofType: null
              }
            }
          },
          {
            name: "rating",
            description: "The rating (1-5)",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          },
          {
            name: "title",
            description: "The review title",
            args: [],
            type: {
              kind: "SCALAR",
              name: "String",
              ofType: null
            }
          },
          {
            name: "content",
            description: "The review content",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "String",
                ofType: null
              }
            }
          },
          {
            name: "createdAt",
            description: "When the review was created",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          },
          {
            name: "updatedAt",
            description: "When the review was last updated",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          }
        ],
        interfaces: [
          {
            kind: "INTERFACE",
            name: "Node",
            ofType: null
          },
          {
            kind: "INTERFACE",
            name: "Timestamped",
            ofType: null
          }
        ]
      },
      {
        kind: "UNION",
        name: "SearchResult",
        description: "A union of all searchable types",
        possibleTypes: [
          {
            kind: "OBJECT",
            name: "Product",
            ofType: null
          },
          {
            kind: "OBJECT",
            name: "User",
            ofType: null
          },
          {
            kind: "OBJECT",
            name: "Category",
            ofType: null
          }
        ]
      },
      {
        kind: "OBJECT",
        name: "Cart",
        description: "A shopping cart",
        fields: [
          {
            name: "id",
            description: "The ID of the cart",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "user",
            description: "The user who owns the cart",
            args: [],
            type: {
              kind: "OBJECT",
              name: "User",
              ofType: null
            }
          },
          {
            name: "items",
            description: "The items in the cart",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "LIST",
                name: null,
                ofType: {
                  kind: "NON_NULL",
                  name: null,
                  ofType: {
                    kind: "OBJECT",
                    name: "CartItem",
                    ofType: null
                  }
                }
              }
            }
          },
          {
            name: "subtotal",
            description: "The subtotal of the cart",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Float",
                ofType: null
              }
            }
          },
          {
            name: "totalItems",
            description: "The total number of items in the cart",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          },
          {
            name: "updatedAt",
            description: "When the cart was last updated",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "DateTime",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      },
      {
        kind: "OBJECT",
        name: "CartItem",
        description: "An item in a shopping cart",
        fields: [
          {
            name: "id",
            description: "The ID of the cart item",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "ID",
                ofType: null
              }
            }
          },
          {
            name: "product",
            description: "The product in the cart",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "OBJECT",
                name: "Product",
                ofType: null
              }
            }
          },
          {
            name: "quantity",
            description: "The quantity of the product",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Int",
                ofType: null
              }
            }
          },
          {
            name: "subtotal",
            description: "The subtotal for this item",
            args: [],
            type: {
              kind: "NON_NULL",
              name: null,
              ofType: {
                kind: "SCALAR",
                name: "Float",
                ofType: null
              }
            }
          }
        ],
        interfaces: []
      }
    ]
  }
}; 