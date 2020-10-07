/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable import/extensions */
import React from 'react';
import axios from 'axios';
import Header from './Header.jsx';
import PhotoGallery from './PhotoGallery.jsx';
import ModalImages from './ModalImages.jsx';
import styles from '../styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLoaded: false,
      clickedPhotoIndex: -1,
      showModalImages: false,
    };
    this.getPhotoGallery = this.getPhotoGallery.bind(this);
    this.renderView = this.renderView.bind(this);
    this.openModalImages = this.openModalImages.bind(this);
    this.closeModalHandler = this.closeModalHandler.bind(this);

    this.updateSaveName = this.updateSaveName.bind(this);
  }

  componentDidMount() {
    const roomId = window.location.pathname.split('/')[2];
    this.getPhotoGallery(roomId);
  }

  getPhotoGallery(roomId) {
    axios.get(`/api/photogallery/${roomId}`)
      .then(({ data }) => {
        console.log('data in axios get req', data);
        const imgUrlList = [];
        const descriptionList = [];
        for (let i = 0; i < data[0].room_photos.length; i += 1) {
          imgUrlList.push(data[0].room_photos[i].imageUrl);
          descriptionList.push(data[0].room_photos[i].description);
        }

        const oneListing = {
          room_id: data[0].room_id,
          title: data[0].title,
          ratings: data[0].ratings,
          number_of_reviews: data[0].number_of_reviews,
          isSuperhost: data[0].isSuperhost,
          address: data[0].address,
          isSaved: data[0].isSaved,
          savedName: data[0].savedName,
          imageList: imgUrlList,
          imgDescriptionList: descriptionList,
        };

        this.setState({
          isLoaded: true,
          data: oneListing,
        });
      })
      .catch((err) => {
        console.log('err on axios get:', err);
      });
  }

  openModalImages(idx) {
    console.log('app openModalImages-idx', idx);
    this.setState({
      clickedPhotoIndex: idx,
      showModalImages: true,
    });
  }

  // PUT - Update existing save name & isSaved
  updateSaveName(room_id, name, boolean) {
    axios.patch(`/api/photogallery/${room_id}`, {
      name,
      isSaved: boolean,
    })
      .then(() => {
        const roomId = window.location.pathname.split('/')[2];
        this.getPhotoGallery(roomId);
      })
      .catch((err) => {
        console.log('err on axios update:', err);
      });
  }

  closeModalHandler() {
    this.setState({
      showModalImages: false,
    });
  }

  renderView() {
    const { isLoaded } = this.state;
    const { clickedPhotoIndex } = this.state;
    const { showModalImages } = this.state;
    const { imageList, imgDescriptionListimgDescriptionList, isSaved } = this.state.data;

    if (!isLoaded) {
      return (
        <div className={styles.spinner}>
          <div className={styles.bounce1} />
          <div className={styles.bounce2} />
          <div className={styles.bounce3} />
        </div>
      );
    }
    // When clicking each photo, a modal will show up
    if (showModalImages) {
      return (
        <ModalImages
          data={this.state.data}
          clickedPhotoIndex={this.state.clickedPhotoIndex}
          closeModalHandler={this.closeModalHandler}
          updateSaveName={this.updateSaveName}
        />
      );
    }

    if (imageList.length >= 5) {
      return (
        <div className={styles.bodyContainer}>
          <Header
            data={this.state.data}
            createNewSaveName={this.updateSaveName}
            updateSaveName={this.updateSaveName}
          />
          <PhotoGallery
            data={this.state.data}
            openModalImages={this.openModalImages}
          />
        </div>
      );
    }
  }

  // Main render()
  render() {
    return this.renderView();
  }
}

export default App;
