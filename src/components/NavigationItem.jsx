import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import { ConfirmModal } from 'react-bootstrap4-modal';
import itemType from '../itemType';
import AddLinkButton from '../containers/AddLinkButton';
import NavigationItemList from './NavigationItemList';
import { NavigationItemPropType, NavigationItemStorePropType } from '../propTypes';
import SectionDisclosureTriangle from '../containers/SectionDisclosureTriangle';

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

  hover(props, monitor) {
    const dragItem = monitor.getItem();

    if (itemType(props.navigationItem) === 'Section' && itemType(dragItem) === 'Link' && !props.navigationItem.expanded) {
      props.onExpand();
    }
  },

  drop(props, monitor) {
    if (!monitor.canDrop()) {
      return;
    }

    const dragItem = monitor.getItem();

    if (props.navigationItem.id === dragItem.id) {
      return;
    }

    if (itemType(props.navigationItem) === 'Section' && itemType(dragItem) === 'Link' && props.navigationItem.expanded) {
      props.onMoveNavigationItemInto(dragItem, props.navigationItems);
    } else {
      props.onMoveNavigationItemOnto(dragItem, props.navigationItems);
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

@DragSource('NAVIGATION_ITEM', navigationItemDragSource, collectNavigationItemDrag)
@DropTarget('NAVIGATION_ITEM', navigationItemDropTarget, collectNavigationItemDrop)
class NavigationItem extends React.Component {
  static propTypes = {
    navigationItem: NavigationItemPropType.isRequired,
    navigationItems: NavigationItemStorePropType.isRequired,
    onDelete: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    client: PropTypes.shape({}).isRequired,

    // These come from @DragSource and @DropTarget

    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,

    // These are used only by the drag/drop stuff above, and eslint incorrectly thinks they're
    // unused

    // eslint-disable-next-line react/no-unused-prop-types
    onExpand: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onMoveNavigationItemInto: PropTypes.func.isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    onMoveNavigationItemOnto: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      isConfirmingDelete: false,
    };
  }

  onClickDelete = () => {
    this.setState({ isConfirmingDelete: true });
  }

  cancelDelete = () => {
    this.setState({ isConfirmingDelete: false });
  }

  confirmDelete = () => {
    this.props.onDelete();
  }

  renderDisclosureTriangle = () => {
    if (itemType(this.props.navigationItem) !== 'Section') {
      return null;
    }

    return (
      <span>
        <SectionDisclosureTriangle navigationItemId={this.props.navigationItem.id} />
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
        <NavigationItemList
          client={this.props.client}
          navigationItems={this.props.navigationItems}
          navigationSectionId={this.props.navigationItem.id}
        />
        <ul className="list-inline mt-2">
          <li className="list-inline-item">
            <AddLinkButton navigationSectionId={this.props.navigationItem.id} />
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
          <button type="button" className="btn btn-secondary btn-sm" onClick={this.props.onEdit}>Edit</button>
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
