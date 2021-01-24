import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import axios, { AxiosResponse } from "axios"
import { NavigationContainer, RouteProp } from "@react-navigation/native";
import { createStackNavigator, StackNavigationProp, } from "@react-navigation/stack";

interface Item {
  id: number,
  title: string,
  price: number,
  description: string,
  category: string,
  image: string
}

type listItemProps = {
  item: Item,
  navigation: StackNavigationProp<StackParams, 'Catalog'>
}

type StackParams = {
  Catalog: undefined,
  ProductScreen: { id: number, title: string, image: string, description: string, category: string, price: number }
}

type FlatListScreenProps = {
  navigation: StackNavigationProp<StackParams, 'Catalog'>
}

type ProductsScreenProps = {
  navigation: StackNavigationProp<StackParams, 'ProductScreen'>
  route: RouteProp<StackParams, 'ProductScreen'>
}

//Flatlist screen
const CatalogListScreen = ({ navigation }: FlatListScreenProps) => {
  const [userData, setUserData] = useState<Item[]>([]);

  //Api Call by using "axios"
  useEffect(() => {
    axios
      .get<Item[]>('https://fakestoreapi.com/products/')
      .then((response: AxiosResponse) => {
        setUserData(response.data);
      })
  }, []);

  return (
    <View>
      <FlatList
        data={userData}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setUserData(userData)
            }}>
            <ItemCard
              item={item}
              navigation={navigation}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

//Display the pressed product
const ProductScreen = ({ route }: ProductsScreenProps) => {
  return (
    <View style={styles.containerProductInfo}>
      <Image style={styles.imageViewProductInfo} source={{ uri: route.params.image }} />
      <Text style={styles.headlineProductInfo}>{route.params.title}</Text>
      <Text style={{
        ...styles.priceProductInfo,
        ...DiscountColor(route.params.price) ? styles.textTrue : styles.textFalse
      }}>{DiscountPrice(route.params.price).toFixed(2)} €</Text>
      <Text style={styles.headlineProductInfo}>Description</Text>
      <Text style={styles.descriptionProductInfo}>{route.params.description}</Text>
      <Text style={styles.categoryProductInfo}>Category: {route.params.category}</Text>
      <TouchableOpacity
        onPress={() => {
          console.log("Item added to cart");
        }}>
        <Text style={styles.addToCartButton}>Add to cart</Text>
      </TouchableOpacity>
    </View>
  );
};


//Navigation function
export default function App() {
  const Stack = createStackNavigator<StackParams>();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Catalog'>
        <Stack.Screen
          name="Catalog"
          component={CatalogListScreen}
          options={{
            title: 'Catalog',
          }}
        />
        <Stack.Screen
          name="ProductScreen"
          component={ProductScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


//Select color for discount product if the price is over 50 €
function DiscountColor(productPrice: number): boolean {
  if (productPrice > 50) {
    return false
  }
  else {
    return true
  }
}

//Count price for discount product if the price is over 50 €
function DiscountPrice(productPrice: number): number {
  if (productPrice > 50) {
    productPrice /= 1.25
    return productPrice
  }
  else {
    return productPrice
  }
}


// Product card
const ItemCard = ({ item, navigation }: listItemProps) => {

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductScreen', {
        id: item.id,
        title: item.title,
        image: item.image,
        category: item.category,
        description: item.description,
        price: item.price
      })} >

      <View style={styles.mainViewCard}>
        <View style={styles.cardContainer}>
          <Image style={styles.imageViewCard} source={{ uri: item.image }} />
          <View>
            <Text style={styles.textCard}>{item.title}</Text>
            <Text style={{
              ...styles.textCard,
              ...DiscountColor(item.price) ? styles.textTrue : styles.textFalse
            }}>
              {DiscountPrice(item.price).toFixed(2)} €
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTrue: {
    color: 'black'
  },
  textFalse: {
    color: 'green'
  },
  cardContainer: {
    padding: 30,
    borderRadius: 10,
    flexDirection: 'row',
    height: 125
  },
  mainViewCard: {
    padding: 10,
    width: '80%'
  },
  imageViewCard: {
    height: 100,
    width: 100
  },
  textCard: {
    fontWeight: 'bold',
    padding: 10,
    width: 215
  },
  containerProductInfo: {
    flex: 1,
    marginTop: 20,
  },
  imageViewProductInfo: {
    height: 300,
    alignItems: 'center',
    alignSelf: 'center',
    width: 300
  },
  headlineProductInfo: {
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    fontSize: 20
  },
  priceProductInfo: {
    marginLeft: 20,
    marginTop: 20,
    fontSize: 18,
    color: 'green'
  },
  descriptionHeaderProductInfo: {
    marginLeft: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionProductInfo: {
    padding: 20,
    fontSize: 14,
  },
  categoryProductInfo: {
    marginLeft: 20,
    fontSize: 14,
    color: 'grey'
  },
  addToCartButton: {
    marginTop: 40,
    textAlign: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  }

});