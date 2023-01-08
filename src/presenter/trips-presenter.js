import TripListView from '../view/trip-list-view.js';
import { render, replace } from '../framework/render.js';
import ListEmptyView from '../view/list-empty-view.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';


const mainEventsElement = document.querySelector('.trip-events');

export default class TripPresenter {
  #pointsModel = null;
  #tripContainer = null;

  #tripListComponent = new TripListView();
  #listPoints = [];
  #pointPresenter = new Map();

  #renderPoint(point) {

    const pointPresenter = new PointPresenter({
      pointListContainer: this.#tripListComponent.element,
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #noPointsComponent = new ListEmptyView();

  #renderNoPoints() {
    render(this.#noPointsComponent, mainEventsElement);
  }

  #clearTaskList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatedPoint);

    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  constructor({ tripContainer, pointsModel }) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    // render(new NewEventBtnView(), tripMain);
    this.#listPoints = [...this.#pointsModel.points];
    if (!this.#listPoints.length) {
      this.#renderNoPoints();
      mainEventsElement.removeChild(document.querySelector('.trip-sort'));
    } else {
      render(this.#tripListComponent, mainEventsElement);
      for (let i = 0; i < this.#listPoints.length; i++) {
        this.#renderPoint(this.#listPoints[i]);
      }
    }
  }
}
