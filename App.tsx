/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useState, useEffect, useRef} from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Button,
  ActivityIndicator,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import {Picker} from "@react-native-community/picker";

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <Doggos />
      </SafeAreaView>
    </>
  );
};

interface Breeds {
  [key: string]: string[];
}

interface Selection {
  breed?: string;
  subBreed?: string;
}

const Doggos = () => {
  let [breeds, setBreeds] = useState<Breeds | undefined>();
  let [selection, setSelection] = useState<Selection>({});
  let [image, setImage] = useState<string | undefined>();
  let [seq, setSeq] = useState(0);

  let [imageLoading, setImageLoading] = useState(false);
  let timeout = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      let res = await fetch("https://dog.ceo/api/breeds/list/all");
      let breeds = ((await res.json()) as {message: Breeds}).message;
      setBreeds(breeds);
      let index = Math.floor(Math.random() * Object.keys(breeds).length);
      let breed = Object.keys(breeds)[index];
      let newSel = {
        breed,
        subBreed: breeds[breed][0] ?? null,
      };
      console.log("newSel", newSel);
      setSelection(newSel);
    })();
  }, []);

  useEffect(() => {
    console.log("In fetch effect");
    setImageLoading(true);
    let url = `https://dog.ceo/api/breed/${[selection.breed, selection.subBreed]
      .filter((x) => !!x)
      .join("/")}/images/random`;
    console.log(selection, url);
    let f = async () => {
      try {
        console.log("Fetching now...");
        let res = await fetch(url);
        let payload = await res.json();
        let image = payload.message as string;
        console.log(image);
        setImage(image);
      } catch (e) {
        console.log(`While fetching image: ${url}`);
      } finally {
        setImageLoading(false);
      }
    };

    if (timeout.current) {
      console.log("Clearing old timeout");
      clearTimeout(timeout.current);
    }
    console.log("Setting timeout for ", url);
    timeout.current = setTimeout(() => {
      console.log("Timeout triggering for ", url);
      timeout.current = null;
      f();
    }, 200);
  }, [seq]);

  useEffect(() => {
    setSeq((s) => s + 1);
  }, [selection.breed, selection.subBreed]);

  if (!breeds) {
    return (
      <View style={{padding: 80}}>
        <ActivityIndicator />
      </View>
    );
  }

  let labelStyle = {
    paddingBottom: 8,
    color: Colors.white,
    fontSize: 18,
  };
  let filterSection = {margin: 20, flexGrow: 1};
  let pickerStyle = {
    color: Colors.black,
  };
  let itemStyle = {};

  let titleCase = (x: string) => {
    if (x.length >= 2) {
      return x.slice(0, 1).toUpperCase() + x.slice(1);
    } else {
      return x.toUpperCase();
    }
  };

  return (
    <View
      style={{...styles.body, alignContent: "stretch", alignItems: "stretch"}}>
      <View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "100",
            alignSelf: "center",
            marginVertical: 8,
          }}>
          Show. Me. Dogs.
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fa5c5c",
        }}>
        <View style={filterSection}>
          <Text style={labelStyle}>Breed</Text>
          <Picker
            itemStyle={itemStyle}
            style={pickerStyle}
            selectedValue={selection.breed!}
            onValueChange={(b) => {
              console.log(`changing breed: ${b}`);
              setSelection((old) => ({
                breed: String(b),
                subBreed: breeds![b][0] ?? null,
              }));
            }}>
            {Object.keys(breeds).map((value) => (
              <Picker.Item key={value} label={titleCase(value)} value={value} />
            ))}
          </Picker>
        </View>
        <View style={filterSection}>
          <Text style={labelStyle}>Sub-breed</Text>
          {breeds[selection.breed!]?.length ? (
            <Picker
              itemStyle={itemStyle}
              style={pickerStyle}
              selectedValue={selection.subBreed!}
              onValueChange={(s) => {
                console.log(`changing subbreed: ${s}`);
                setSelection((old) => ({...old, subBreed: String(s)}));
              }}>
              {breeds[selection.breed!].map((value) => (
                <Picker.Item
                  key={value}
                  label={titleCase(value)}
                  value={value}
                />
              ))}
            </Picker>
          ) : (
            <Text style={{marginVertical: 6, color: Colors.dark}}>
              None available
            </Text>
          )}
        </View>
      </View>
      <View style={{backgroundColor: "#222"}}>
        <Image
          style={{flexBasis: 600}}
          source={{uri: image}}
          resizeMode="contain"
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          padding: 12,
        }}>
        <View
          style={{
            height: 40,
            flexDirection: "row",
            alignItems: "center",
            flexGrow: 1,
          }}>
          <Text style={{fontSize: 14, marginHorizontal: 4}}>Data from </Text>
          <TouchableOpacity
            onPress={() => {
              Linking.openURL("https://dog.ceo/dog-api/");
            }}>
            <Text style={{color: Colors.lighter}}>
              https://dog.ceo/dog-api/
            </Text>
          </TouchableOpacity>
        </View>
        {imageLoading ? (
          <ActivityIndicator />
        ) : (
          <Button
            title="🐶 Show another"
            onPress={() => setSeq((s) => s + 1)}
          />
        )}
      </View>
    </View>
  );
};

const Colors = {
  white: "#fff",
  lighter: "#8282ff",
  dark: "#ddd",
  black: "#000",
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: "absolute",
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
    color: Colors.dark,
  },
  highlight: {
    fontWeight: "700",
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: "600",
    padding: 4,
    paddingRight: 12,
    textAlign: "right",
  },
});

export default App;
