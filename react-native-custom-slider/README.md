
# react-native-react-native-custom-slider

## Getting started

`$ npm install react-native-react-native-custom-slider --save`

### Mostly automatic installation

`$ react-native link react-native-react-native-custom-slider`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-react-native-custom-slider` and add `RNReactNativeCustomSlider.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNReactNativeCustomSlider.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNReactNativeCustomSliderPackage;` to the imports at the top of the file
  - Add `new RNReactNativeCustomSliderPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-react-native-custom-slider'
  	project(':react-native-react-native-custom-slider').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-react-native-custom-slider/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-react-native-custom-slider')
  	```

#### Windows
[Read it! :D](https://github.com/ReactWindows/react-native)

1. In Visual Studio add the `RNReactNativeCustomSlider.sln` in `node_modules/react-native-react-native-custom-slider/windows/RNReactNativeCustomSlider.sln` folder to their solution, reference from their app.
2. Open up your `MainPage.cs` app
  - Add `using React.Native.Custom.Slider.RNReactNativeCustomSlider;` to the usings at the top of the file
  - Add `new RNReactNativeCustomSliderPackage()` to the `List<IReactPackage>` returned by the `Packages` method


## Usage
```javascript
import RNReactNativeCustomSlider from 'react-native-react-native-custom-slider';

// TODO: What to do with the module?
RNReactNativeCustomSlider;
```
  