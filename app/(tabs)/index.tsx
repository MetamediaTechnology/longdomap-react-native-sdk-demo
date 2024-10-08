import { StyleSheet, View, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import Longdo from 'longdomap-react-native-sdk';
import { useRef } from 'react';
import React from 'react';

interface Location {
  lon: number;
  lat: number;
}

export default function HomeScreen() {

  Longdo.apiKey = '689a08b0a311d3c496d0cba1e27c129a'
  let map: any;

  const onChangeBaseMap = (layer: string) => {
    map.call('Layers.setBase', Longdo.static('Layers', layer))
  }
  const [layers, setLayers] = React.useState<string[]>([]);
  const [markerList, setMarkerList] = React.useState<any[]>([]);
  const [_, setPopup] = React.useState<any>();
  const [currentLocation, setCurrentLocation] = React.useState<Location>();
  const [currentZoom, setCurrentZoom] = React.useState<number>(15);

  const onMapReady = async () => {
    console.log('Map is ready');
    let loc: Location = { lon: 100.5, lat: 13.7 };
    map.call('location', loc);
    setCurrentLocation(loc);
  };

  const ramdomLocationInBangkok = () => {
    const lon = 100.5 + Math.random() * 0.1;
    const lat = 13.7 + Math.random() * 0.1;
    return { lon, lat } as Location;
  };

  return (
    <View style={styles.container}>
    <View style={styles.box}>
      <Text style={styles.textHeader}>Longdo MAP</Text>
      <Longdo.MapView
        ref={(r: any) => {
          map = r;
        }}
        zoom={15}
        onReady={() => {
          onMapReady();
        }}
        onClick={(location: any) => {
          console.log({ location });
        }}
        onLocation={async () => {
          const loc: Location = await map.call('location');
          const zoom: number = await map.call('zoom');
          setCurrentLocation(loc);
          setCurrentZoom(zoom);
        }}
        onDrag={async () => {
          const loc: Location = await map.call('location');
          const zoom: number = await map.call('zoom');
          setCurrentZoom(zoom);
          setCurrentLocation(loc);
        }}
      />
    </View>
    <ScrollView>
      <Text>
        Crosshair:{' '}
        {`{ lon: ${currentLocation?.lat?.toFixed(3) || '-'}, lat: ${currentLocation?.lon?.toFixed(3) || '-'} }`}
      </Text>
      <Text>Zoom: {`${currentZoom}`}</Text>
      <Text style={styles.textSubHeader}>____</Text>
      <Text style={styles.textSubHeader}>Base Map</Text>
      <View style={styles.row}>
        <TouchableOpacity
          key={'DARK'}
          onPress={() => {
            map.call('Layers.setBase', Longdo.static('Layers', 'DARK'));
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>DARK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={'LIGHT'}
          onPress={() => {
            map.call('Layers.setBase', Longdo.static('Layers', 'LIGHT'));
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>LIGHT</Text>
        </TouchableOpacity>
      </View>
      <Text>
        <Text style={styles.textSubHeader}>Add Layer</Text>
      </Text>
      <View style={styles.row}>
        <TouchableOpacity
          key={'TRAFFIC'}
          onPress={() => {
            const layerName = 'TRAFFIC';
            if (layers.find((layer) => layer === layerName)) {
              map.call('Layers.remove', Longdo.static('Layers', 'TRAFFIC'));
              setLayers(layers.filter((layer) => layer !== layerName));
            } else {
              map.call('Layers.add', Longdo.static('Layers', 'TRAFFIC'));
              setLayers([...layers, layerName]);
            }
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>TRAFFIC</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={'WMS'}
          onPress={() => {
            const layerName = 'bluemarble_terrain';
            var wms_layer = Longdo.object('Layer', 'bluemarble_terrain', {
              type: Longdo.static('LayerType', 'WMS'),
              url: 'https://ms.longdo.com/mapproxy/service',
              zoomRange: { min: 1, max: 9 },
              refresh: 180,
            });
            if (layers.find((layer) => layer === layerName)) {
              map.call('Layers.remove', wms_layer);
              setLayers(layers.filter((layer) => layer !== layerName));
              return;
            } else {
              map.call('Layers.insert', '', wms_layer);
              map.call('location', { lon: 100.5, lat: 13.7 });
              map.call('zoom', 7);
              setLayers([...layers, layerName]);
            }
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>WMS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={'TMS'}
          onPress={() => {
            const layerName = 'bluemarble_terrain_tms';
            var tms_layer = Longdo.object('Layer', '', {
              type: Longdo.static('LayerType', 'TMS'),
              url: 'https://ms.longdo.com/mapproxy/tms/1.0.0/bluemarble_terrain/EPSG3857',
            });
            if (layers.find((layer) => layer === layerName)) {
              setLayers(layers.filter((layer) => layer !== layerName));
              return;
            } else {
              map.call('Layers.insert', '', tms_layer);
              map.call('location', { lon: 100.5, lat: 13.7 });
              map.call('zoom', 7);
              setLayers([...layers, layerName]);
            }
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>TMS</Text>
        </TouchableOpacity>
      </View>
      <Text>
        <Text style={styles.textSubHeader}>Control</Text>
      </Text>
      <View style={styles.row}>
        <TouchableOpacity
          key={'zoomIn'}
          onPress={() => {
            map.call('zoom', 15);
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>Zoom In to 15</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={'TMS'}
          onPress={() => {
            map.call('location', { lon: 100.55, lat: 13.55 });
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>Move to 13.550, 100.550</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          key={'zoomOut'}
          onPress={() => {
            map.call('zoom', 5);
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>Zoom Out to 5</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={'language'}
          onPress={async () => {
            const currentLang = await map.call('language');
            console.log(currentLang);
            if (currentLang === 'en') {
              map.call('language', 'th');
            } else {
              map.call('language', 'en');
            }
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>Switch Language</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.textSubHeader}>Overlays</Text>
      <View style={styles.row}>
        <TouchableOpacity
          key={'marker-basic'}
          onPress={async () => {
            const locationRamdom = ramdomLocationInBangkok();
            let _marker = Longdo.object('Marker', {
              lon: locationRamdom.lon,
              lat: locationRamdom.lat,
            });
            map.call('Overlays.add', _marker);
            map.call('location', locationRamdom);
            const markers = [...markerList, _marker];
            setMarkerList(markers);
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>Add Marker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={'marker-remove'}
          onPress={async () => {
            const _marker = markerList.pop();
            map.call('Overlays.remove', _marker);
            setMarkerList(markerList);
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>Remove Marker</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          key={'add-popup'}
          onPress={async () => {
            const _popup = Longdo.object(
              'Popup',
              { lon: 100.54, lat: 13.77 },
              {
                title: 'Title',
                detail: '<em>This is popup detail</em>',
              }
            );

            map.call('Overlays.add', _popup);
            map.call('location', { lon: 100.54, lat: 13.77 });
            setPopup(_popup);
          }}
          style={[styles.button]}
        >
          <Text style={styles.buttonLabel}>Add Popup</Text>
        </TouchableOpacity>
        <TouchableOpacity
          key={'overlay-clear'}
          onPress={async () => {
            map.call('Overlays.clear');
          }}
          style={[styles.buttonDanger]}
        >
          <Text style={styles.buttonLabel}>Clear All</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    marginTop: 50,
    marginBottom: 10,
    height: 500,
  },
  textHeader: {
    color: '#1565c0',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textSubHeader: {
    color: '#1565c0',
    textAlign: 'left',
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  button: {
    height: 25,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#1565c0',
    alignSelf: 'flex-start',
    marginHorizontal: '2%',
    marginBottom: 6,
    minWidth: '45%',
    textAlign: 'center',
    color: 'white',
  },
  buttonSuccess: {
    height: 25,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: '#43a047',
    alignSelf: 'flex-start',
    marginHorizontal: '2%',
    marginBottom: 6,
    minWidth: '45%',
    textAlign: 'center',
    color: 'white',
  },
  buttonDanger: {
    backgroundColor: '#d32f2f',
    height: 25,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginHorizontal: '2%',
    marginBottom: 6,
    minWidth: '45%',
    textAlign: 'center',
    color: 'white',
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
