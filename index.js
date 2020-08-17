const { ApolloServer, gql } = require("apollo-server");

const machines = [
  {
    id: "cc7ca35f-b415-45e1-8b72-0f92131904e0",
    name: "Truck Engine",
    lastKnownPosition: { lat: "51.661519", lng: "6.4543203" },
  },
];

const sensors = [
  {
    id: "5c3f0a37-494c-40a8-a5ce-65e26c4f24a8",
    name: "Truck Engine Temperature",
    machine: "Truck Engine",
  },
  {
    id: "a3184ee2-d07e-4bf6-8da3-9a0704f81b5e",
    name: "Truck Engine Noise",
    machine: "Truck Engine",
  },
  {
    id: "2f534c27-c3c9-4224-a26f-980aa9b70afb",
    name: "Truck Engine Uptime",
    machine: "Truck Engine",
  },
];

const sensor_data = [
  {
    timestamp: 1355314100,
    value: 65.5,
    sensor: "Truck Engine Temperature",
  },
  {
    timestamp: 1355314200,
    value: 72.1,
    sensor: "Truck Engine Temperature",
  },
  {
    timestamp: 1355314300,
    value: 75,
    sensor: "Truck Engine Temperature",
  },
  {
    timestamp: 1355314400,
    value: 76.9,
    sensor: "Truck Engine Temperature",
  },
  {
    timestamp: 1355314100,
    value: 550,
    sensor: "Truck Engine Noise",
  },
  {
    timestamp: 1355314200,
    value: 560,
    sensor: "Truck Engine Noise",
  },
  {
    timestamp: 1355314300,
    value: 545,
    sensor: "Truck Engine Noise",
  },
  {
    timestamp: 1355314400,
    value: 555,
    sensor: "Truck Engine Noise",
  },
];

const typeDefs = gql`
  scalar DateTime
  scalar MachineWhereUniqInput

  type GPSPosition {
    lat: String!
    lng: String!
  }

  type Machine {
    id: ID!
    name: String!
    sensors: [Sensor!]
    lastKnownPosition: GPSPosition
  }

  type Sensor {
    id: ID!
    name: String!
    machine: Machine!
    sensor_data: SensorDataPoint
  }

  type SensorDataPoint {
    timestamp: DateTime!
    value: Float!
  }

  type Query {
    machine(which: MachineWhereUniqInput!): Machine!
    machines: [Machine!]
    sensor_data(
      name: String!
      from: DateTime!
      to: DateTime!
    ): [SensorDataPoint!]
    sensor: [Sensor!]
  }
`;

const resolvers = {
  Query: {
    machine: (parent, { which }) =>
      machines.find((machine) => machine.id === which),
    machines: () => machines,
    sensor_data: (parent, { name, from, to }) =>
      // todo: verify parent.name === name exists
      sensor_data.filter(
        (sensor_datum) =>
          sensor_datum.sensor === name &&
          sensor_datum.timestamp >= from &&
          sensor_datum.timestamp <= to
      ),
  },
  Machine: {
    sensors: (parent) =>
      sensors.filter((sensor) => sensor.machine === parent.name),
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
