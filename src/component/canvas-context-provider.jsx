import React from 'react';
import {fabric} from 'fabric';
import {backgroundImages} from '../constant';

const CanvasContext = React.createContext();

export class CanvasContextProvider extends React.Component {
  state = {activeObject: null};

  componentDidMount() {
    let zoomRatio = window.innerWidth * 0.75 / 854;
    if (zoomRatio > 1) {
      zoomRatio = 1;
    }
    this.canvas = new fabric.Canvas('canvas', {
      backgroundColor: 'lightgrey',
      width: 854,
      height: 480,
    });
    this.canvas.setDimensions({
      width: this.canvas.getWidth() * zoomRatio,
      height: this.canvas.getHeight() * zoomRatio
    });
    // this.canvas.setZoom(zoomRatio);
    this.loadDefaultBackgroundImage(backgroundImages[0]);
    this.addListener();
  }

  addListener = () => {
    [
      'selection:created',
      'selection:updated',
      'object:moved',
      'object:scaled',
      'object:rotated',
    ].forEach(event => {
      this.canvas.on(event, event =>
        this.setState({
          activeObject: event.target,
        })
      );
    });

    this.canvas.on('selection:cleared', _ => {
      this.setState({activeObject: null});
    });

    this.canvas.on('after:render', () => {
      this.canvas.calcOffset();
    });
  };

  noActiveObject = () => this.state.activeObject === null;

  addText = text => {
    const newText = new fabric.Textbox(text, {
      angle: 0,
      fill: '#ffffff',
      fontFamily: 'PMingLiU',
      fontSize: 40,
      fontStyle: '',
      fontWeight: 'normal',
      left: 50,
      textAlign: 'left',
      top: 100,
      stroke: null,
      strokeWidth: 0,
    });
    this.canvas.add(newText).setActiveObject(newText);
  };

  addImage = url => {
    if (url.trim().length === 0) return;
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();
    this.loadImage(url, canvasWidth / 2, canvasHeight / 2, 1, image => {
      this.canvas.add(image).setActiveObject(image);
    });
  };

  removeSelectedText = () => {
    this.canvas.remove(this.canvas.getActiveObject()).requestRenderAll();
  };

  removeAllText = () => {
    this.canvas.remove(...this.canvas.getObjects()).requestRenderAll();
  };

  loadDefaultBackgroundImage = backgroundImage => {
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();
    this.loadImage(backgroundImage, canvasWidth, canvasHeight, 0.8, image => {
      this.canvas.setBackgroundImage(image);
      this.canvas.requestRenderAll();
    });
  };

  changeBackgroundImage = event => {
    const src = event.target.src;
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();
    this.loadImage(src, canvasWidth, canvasHeight, 0.8, image => {
      this.canvas.setBackgroundImage(image);
      this.canvas.requestRenderAll();
    });
  };

  changeBackgroundImageFromUrl = event => {
    const value = event.target.value;
    if (value.trim().length === 0) return;
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();
    this.loadImage(value, canvasWidth, canvasHeight, 0.8, image => {
      this.canvas.setBackgroundImage(image);
      this.canvas.requestRenderAll();
    });
  };

  loadImage = (image, expectedWidth, expectedHeight, opacity, callback) => {
    fabric.Image.fromURL(image, image => {
      const canvasRatio = expectedWidth / expectedHeight;
      const imageRatio = image.width / image.height;
      let left, top, scaleFactor;
      if (canvasRatio >= imageRatio) {
        scaleFactor = expectedWidth / image.width;
        left = 0;
        top = -(image.height * scaleFactor - expectedHeight) / 2;
      } else {
        scaleFactor = expectedHeight / image.height;
        top = 0;
        left = -(image.width * scaleFactor - expectedWidth) / 2;
      }
      image.set({
        top: top,
        left: left,
        originX: 'left',
        originY: 'top',
        scaleX: scaleFactor,
        scaleY: scaleFactor,
        opacity: opacity,
      });
      callback(image);
    });
  };

  onCoordinateChange = (coordinate, value) => {
    if (this.noActiveObject()) return;
    const activeObject = this.canvas.getActiveObject();
    activeObject.set(coordinate, value);
    activeObject.setCoords();
    this.canvas.requestRenderAll();
  };

  onSizeChange = (size, value) => {
    if (this.noActiveObject()) return;
    this.canvas
      .getActiveObject()
      .set(size, value)
      .setCoords();
    this.canvas.requestRenderAll();
  };

  onAngleChange = angle => {
    if (this.noActiveObject()) return;
    this.canvas.getActiveObject().rotate(angle);
    this.canvas.requestRenderAll();
  };

  onFontChange = font => {
    if (this.noActiveObject()) return;
    this.canvas.getActiveObject().set('fontFamily', font);
    this.canvas.requestRenderAll();
  };

  onFontColorChange = color => {
    if (this.noActiveObject()) return;
    this.canvas.getActiveObject().set('fill', color);
    this.canvas.requestRenderAll();
  };

  onFontSizeChange = size => {
    if (this.noActiveObject()) return;
    this.canvas.getActiveObject().set('fontSize', size);
    this.canvas.requestRenderAll();
  };

  onStrokeColorChange = color => {
    if (this.noActiveObject()) return;
    this.canvas.getActiveObject().set('stroke', color);
    this.canvas.requestRenderAll();
  };

  onStrokeWidthChange = width => {
    if (this.noActiveObject()) return;
    this.canvas.getActiveObject().set('strokeWidth', width);
    this.canvas.requestRenderAll();
  };

  onTextFormatChange = formats => {
    if (this.noActiveObject()) return;
    this.onBold(formats.includes('bold'));
    this.onItalic(formats.includes('italic'));
    this.onUnderline(formats.includes('underline'));
    this.onLinethrough(formats.includes('linethrough'));
  };

  onBold = bold => {
    this.canvas.getActiveObject().set('fontWeight', bold ? 'bold' : 'normal');
    this.canvas.requestRenderAll();
  };

  onItalic = italic => {
    this.canvas
      .getActiveObject()
      .set('fontStyle', italic ? 'italic' : 'normal');
    this.canvas.requestRenderAll();
  };

  onUnderline = underline => {
    this.canvas.getActiveObject().set('underline', underline);
    this.canvas.requestRenderAll();
  };

  onLinethrough = linethrough => {
    this.canvas.getActiveObject().set('linethrough', linethrough);
    this.canvas.requestRenderAll();
  };

  onTextAlignmentChange = alignment => {
    if (this.noActiveObject()) return;
    this.canvas.getActiveObject().set('textAlign', alignment);
    this.canvas.requestRenderAll();
  };

  setGradient = type => {
    if (this.noActiveObject()) return;
    const object = this.canvas.getActiveObject();
    object.setGradient(type, {
      type: 'linear',
      x1: 0,
      y1: object.height,
      x2: object.width,
      y2: object.height,
      colorStops: {
        0: 'red',
        0.2: 'orange',
        0.4: 'yellow',
        0.6: 'green',
        0.8: 'blue',
        1: 'violet',
      },
    });
    this.canvas.requestRenderAll();
  };

  setShadow = event => {
    if (this.noActiveObject()) return;
    this.canvas.getActiveObject().setShadow(
      event.target.checked
        ? {
          color: 'rgba(0,0,0,0.7)',
          blur: 10,
          offsetX: 2,
          offsetY: 2,
        }
        : null
    );
    this.canvas.requestRenderAll();
  };

  saveImage = event => {
    event.persist();
    event.target.parentElement.parentElement.parentElement.href = this.canvas.toDataURL({format: 'png', quality: 0.8});
  };

  render = () => {
    const {children} = this.props;
    const {activeObject} = this.state;
    const {
      addText,
      addImage,
      removeSelectedText,
      removeAllText,
      onCoordinateChange,
      onSizeChange,
      onAngleChange,
      onFontChange,
      onFontColorChange,
      onFontSizeChange,
      onStrokeColorChange,
      onStrokeWidthChange,
      onTextFormatChange,
      onTextAlignmentChange,
      setGradient,
      setShadow,
      changeBackgroundImage,
      changeBackgroundImageFromUrl,
      saveImage,
    } = this;
    return (
      <CanvasContext.Provider
        value={{
          activeObject: activeObject,
          addText: addText,
          addImage: addImage,
          removeSelectedText: removeSelectedText,
          removeAllText: removeAllText,
          onCoordinateChange: onCoordinateChange,
          onAngleChange: onAngleChange,
          onSizeChange: onSizeChange,
          onFontChange: onFontChange,
          onFontColorChange: onFontColorChange,
          onFontSizeChange: onFontSizeChange,
          onStrokeColorChange: onStrokeColorChange,
          onStrokeWidthChange: onStrokeWidthChange,
          onTextFormatChange: onTextFormatChange,
          onTextAlignmentChange: onTextAlignmentChange,
          setGradient: setGradient,
          setShadow: setShadow,
          changeBackgroundImage: changeBackgroundImage,
          changeBackgroundImageFromUrl: changeBackgroundImageFromUrl,
          saveImage: saveImage,
        }}
      >
        {children}
      </CanvasContext.Provider>
    );
  };
}

export const CanvasContextConsumer = CanvasContext.Consumer;
