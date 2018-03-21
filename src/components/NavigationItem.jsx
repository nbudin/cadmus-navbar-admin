import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import { ConfirmModal } from 'react-bootstrap4-modal';
import itemType from '../itemType';
import AddButton from './AddButton';
import { navigationItemEditingController } from '../EditingNavigationItemContext';
import NavigationItemList from './NavigationItemList';
import { NavigationItemPropType, NavigationItemStorePropType } from '../propTypes';
import SectionDisclosureTriangle from './SectionDisclosureTriangle';
import { withClient } from '../ClientContext';
import { withDataContext } from '../DataContext';

const navigationItemDragSource = {
  beginDrag(props) {
    return props.navigationItem;
  },
};

const navigationItemDropTarget = {
  canDrop(props, monitor) {
    const dragItem = monitor.getItem();
    const dragItemType = itemType(dragItem);
    const myItemType = itemType(props.navigationItem);
    const iAmInANavigationSection = props.navigationItem.navigation_section_id;

    // Can't drop a section onto a link that's already in a section
    if (dragItemType === 'Section' && myItemType === 'Link' && iAmInANavigationSection) {
      return false;
    }

    // Links can swap with other links, so don't allow drops except directly onto an item
    if (dragItemType === 'Link' && !monitor.isOver({ shallow: true })) {
      return false;
    }

    return true;
  },

  hover(props, monitor, component) {
    const dragItem = monitor.getItem();

    if (itemType(props.navigationItem) === 'Section' && itemType(dragItem) === 'Link' && !props.navigationItem.expanded) {
      component.expand();
    }
  },

  drop(props, monitor, component) {
    if (!monitor.canDrop()) {
      return;
    }

    const dragItem = monitor.getItem();

    if (props.navigationItem.id === dragItem.id) {
      return;
    }

    if (itemType(props.navigationItem) === 'Section' && itemType(dragItem) === 'Link' && props.navigationItem.expanded) {
      component.onMoveNavigationItemInto(dragItem);
    } else {
      component.onMoveNavigationItemOnto(dragItem);
    }
  },
};

function collectNavigationItemDrag(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

function collectNavigationItemDrop(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

@withClient
@withDataContext
@navigationItemEditingController
@DragSource('NAVIGATION_ITEM', navigationItemDragSource, collectNavigationItemDrag)
@DropTarget('NAVIGATION_ITEM', navigationItemDropTarget, collectNavigationItemDrop)
class NavigationItem extends React.Component {
  static propTypes = {
    navigationItem: NavigationItemPropType.isRequired,
    navigationItemStore: NavigationItemStorePropType.isRequired,
    setNavigationItemStore: PropTypes.func.isRequired,
    editNavigationItem: PropTypes.func.isRequired,
    newNavigationLink: PropTypes.func.isRequired,
    client: PropTypes.shape({
      sortNavigationItems: PropTypes.func.isRequired,
      deleteNavigationItem: PropTypes.func.isRequired,
    }).isRequired,

    // These come from @DragSource and @DropTarget

    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isConfirmingDelete: false,
    };
  }

  onMoveNavigationItemOnto = async (movedItem) => {
    const myItem = this.props.navigationItem;
    const sameSection = (movedItem.navigation_section_id === myItem.navigation_section_id);
    const movingDown = (sameSection && movedItem.position < myItem.position);

    let newNavigationItems;
    if (movingDown) {
      newNavigationItems = this.props.navigationItemStore.reposition(
        movedItem.id,
        myItem.navigation_section_id,
        myItem.position + 1,
      );
    } else {
      newNavigationItems = this.props.navigationItemStore.reposition(
        movedItem.id,
        myItem.navigation_section_id,
        myItem.position,
      );
    }

    await this.props.client.sortNavigationItems(newNavigationItems);
    this.props.setNavigationItemStore(
      this.props.navigationItemStore.applySort(newNavigationItems),
    );
  }

  onMoveNavigationItemInto = async (movedItem) => {
    const newNavigationItems = this.props.navigationItemStore.reposition(
      movedItem.id,
      this.props.navigationItem.id,
      1,
    );

    await this.props.client.sortNavigationItems(newNavigationItems);
    this.props.setNavigationItemStore(
      this.props.navigationItemStore.applySort(newNavigationItems),
    );
  }

  onClickDelete = () => {
    this.setState({ isConfirmingDelete: true });
  }

  cancelDelete = () => {
    this.setState({ isConfirmingDelete: false });
  }

  confirmDelete = async () => {
    await this.props.client.deleteNavigationItem(this.props.navigationItem);

    const newStore = this.props.navigationItemStore.delete(this.props.navigationItem.id);
    this.props.setNavigationItemStore(newStore);
  }

  editNavigationItem = () => {
    this.props.editNavigationItem(this.props.navigationItem);
  }

  expand = () => {
    this.props.setNavigationItemStore(
      this.props.navigationItemStore.update(
        this.props.navigationItem.id,
        navigationItem => ({ ...navigationItem, expanded: true }),
      ),
    );
  }

  newLinkClicked = () => {
    this.props.newNavigationLink(this.props.navigationItem.id);
  }

  renderDisclosureTriangle = () => {
    if (itemType(this.props.navigationItem) !== 'Section') {
      return null;
    }

    return (
      <span>
        <SectionDisclosureTriangle navigationSectionId={this.props.navigationItem.id} />
        {' '}
      </span>
    );
  }

  renderConfirmDelete = () => (
    <ConfirmModal
      visible={this.state.isConfirmingDelete}
      onCancel={this.cancelDelete}
      onOK={this.confirmDelete}
    >
      Are you sure you want to delete {this.props.navigationItem.title} from the navigation bar?
      </ConfirmModal>
  );

  renderSectionItems = () => {
    if (itemType(this.props.navigationItem) !== 'Section' || !this.props.navigationItem.expanded) {
      return null;
    }

    return (
      <div className="w-100 mt-2">
        <NavigationItemList navigationSectionId={this.props.navigationItem.id} />
        <ul className="list-inline mt-2">
          <li className="list-inline-item">
            <AddButton onClick={this.newLinkClicked}>
              Add link
            </AddButton>
          </li>
        </ul>
      </div>
    );
  }

  renderItemContent = () => {
    const { navigationItem } = this.props;

    return (
      <div className="row w-100">
        <div className="col">
          {this.renderDisclosureTriangle()}
          <strong>{itemType(navigationItem)}:</strong>
          {' '}
          {navigationItem.title}
        </div>
        <div className="col text-right">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => { this.editNavigationItem(); }}
          >
            Edit
          </button>
          {' '}
          <button type="button" className="btn btn-danger btn-sm" onClick={this.onClickDelete}>Delete</button>
        </div>
      </div>
    );
  }

  render = () => {
    const { connectDragSource, connectDropTarget, isDragging } = this.props;

    return connectDragSource(
      connectDropTarget(
        <li className={classNames('list-group-item draggable', { dragging: isDragging })}>
          {this.renderItemContent()}
          {this.renderSectionItems()}
          {this.renderConfirmDelete()}
        </li>,
      ),
    );
  }
}

export default NavigationItem;
