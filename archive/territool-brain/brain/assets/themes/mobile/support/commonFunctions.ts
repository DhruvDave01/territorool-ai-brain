import moment from 'moment';
import {Alert, Dimensions, PermissionsAndroid, PixelRatio, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const {width, height} = Dimensions.get('window');
export const ScreenWidth = width;
export const ScreenHeight = height;

export const iPhoneX =
  Platform.OS === 'ios' &&
  (Dimensions.get('window').height === 812 ||
    Dimensions.get('window').height === 896 ||
    Dimensions.get('window').height === 844 ||
    Dimensions.get('window').height === 926 ||
    Dimensions.get('window').height === 852 ||
    Dimensions.get('window').height === 932 ||
    Dimensions.get('window').height === 780) &&
  (Dimensions.get('window').width === 375 ||
    Dimensions.get('window').width === 414 ||
    Dimensions.get('window').width === 390 ||
    Dimensions.get('window').width === 428 ||
    Dimensions.get('window').width === 393 ||
    Dimensions.get('window').width === 430 ||
    Dimensions.get('window').width === 360);

const baseWidth = 393;
const baseHeight = 852;

const scaleWidth = width / baseWidth;
const scaleHeight = height / baseHeight;
const scale = Math.min(scaleWidth, scaleHeight);

export const scaledSize = (size: number = 0) => Math.ceil(size * scale);

/**
 * PLATFORM - CONSTANTS TO CHECK THE PLATFORM
 */
export const IS_IOS = Platform.OS === 'ios';
export const IS_ANDROID = Platform.OS === 'android';

/**
 * GET SIZE RELATIVE TO DEVICE DIMENSIONS
 * */
export const deviceRelativeWidth = (percent: number) => {
  return (width * percent) / 100;
};
export const deviceRelativeHeight = (percent: number) => {
  return (height * percent) / 100;
};

export const appVersion = DeviceInfo.getVersion();

/**
 * Function for make capital word
 * @param string
 * @returns
 */
export const capitalize = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const isValidEmail = (email: string) =>
  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

/**
 * Function for convert date formate DD MMMM YYYY
 * @param string
 * @returns
 */
export const dateFormate = (string: string) => {
  return moment(string, 'YYYY-MM-DD hh:mm:ss').format('DD MMM YYYY');
};

/**
 * Function for time converter
 * @param string
 * @returns
 */
export const timeFormat = (string: string) => {
  return moment(string, 'YYYYMMDD').fromNow();
};


const getDeviceDPI = () => {
  switch (PixelRatio.get().toString()) {
    case '1':
      return 'mdpi';
    case '1.5':
      return 'hdpi';
    case '2':
      return 'xhdpi';
    case '3':
      return 'xxhdpi';
    case '3.5':
      return 'xxxhdpi';
    default:
      return 'mdpi';
  }
};

export const commonApiHeaders: any = (
  isToken: boolean,
  token: string,
) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      // Connection: 'keep-alive',
      device_os: Platform.OS,
      device_modal: DeviceInfo.getModel(),
      app_version: DeviceInfo.getVersion(),
      build_version: DeviceInfo.getBuildNumber(),
      os_version: Platform.Version as string,
      device_resolution: ScreenWidth.toString() + 'x' + ScreenHeight.toString(),
      device_DPI: getDeviceDPI(),
      Authorization: isToken ? token : '',
    },
  };
};


// Get camera permission from user
export const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'The application requires access to the camera.',
          buttonPositive: '',
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      return false;
    }
  } else {
    return true;
  }
};

//Get storage permission from user (API 33+ uses system photo picker — no READ_MEDIA_*).
export const requestExternalWritePermission = async () => {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    return true;
  }
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'The application requires permission to write.',
          buttonPositive: '',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      Alert.alert('Digital Avatar', 'Write permission err', err);
    }
    return false;
  }
  return true;
};

export const CaptureMediaFunction = (type: any) =>
  new Promise(async (resolve, reject) => {
    let options: any = {
      mediaType: type,
      quality: 1,
      videoQuality: 'high',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: false,
      formatToMp4: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();

    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        if (response.didCancel) {
          Alert.alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          Alert.alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          Alert.alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          Alert.alert('Digital Avatar', response.errorMessage);
          return;
        }
        resolve(response);
      });
    } else {
      reject('The permission has not been granted.');
    }
  });

export const getMediaFromGalleryFunction = (
  type: any,
  selectionLimitValue: number = 1,
) =>
  new Promise(async (resolve, reject) => {
    let options: any = {
      mediaType: type,
      quality: 1,
      videoQuality: 'high',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: false,
      formatToMp4: true,
      selectionLimit: selectionLimitValue,
    };
    const skipGalleryPermission =
      Platform.OS === 'android' &&
      typeof Platform.Version === 'number' &&
      Platform.Version >= 33;

    if (!skipGalleryPermission) {
      const isStoragePermitted = await requestExternalWritePermission();
      if (!isStoragePermitted) {
        reject('The permission has not been granted.');
        return;
      }
    }

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        Alert.alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        Alert.alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        Alert.alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        Alert.alert('Digital Avatar', response.errorMessage);
        return;
      }
      resolve(response);
    });
  });
