import React from 'react';
import PropTypes from 'prop-types';
import createReactContext from 'create-react-context';
import { withClient } from './ClientContext';
import { withDataContext } from './DataContext';

const EditingNavigationItemContext = createReactContext({
  navigationItem: null,
  save: () => {},
  cancel: () => {},
  startEditing: () => {},
  navigationItemChanged: () => {},
});

const EditingNavigationItemContextConsumer = EditingNavigationItemContext.Consumer;

class EditingNavigationItemContextProvider extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    client: PropTypes.shape({
      saveNavigationItem: PropTypes.func.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    children: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      navigationItem: null,
      saveCallback: null,
    };
  }

  save = async () => {
    const response = await this.props.client.saveNavigationItem(this.state.navigationItem);
    if (this.state.saveCallback) {
      this.state.saveCallback(response);
    }
    this.setState({ navigationItem: null, saveCallback: null });
    return response;
  }

  cancel = () => {
    this.setState({ navigationItem: null, saveCallback: null });
  }

  startEditing = (initialNavigationItem, saveCallback) => {
    this.setState({ navigationItem: initialNavigationItem, saveCallback });
  }

  navigationItemChanged = (navigationItem) => {
    this.setState({ navigationItem });
  }

  render = () => (
    <EditingNavigationItemContext.Provider
      value={{
        navigationItem: this.state.navigationItem,
        save: this.save,
        cancel: this.cancel,
        startEditing: this.startEditing,
        navigationItemChanged: this.navigationItemChanged,
      }}
    >
      {this.props.children}
    </EditingNavigationItemContext.Provider>
  )
}

const EditingNavigationItemContextProviderWithClient = withClient(
  EditingNavigationItemContextProvider,
);

export { EditingNavigationItemContextProviderWithClient as EditingNavigationItemContextProvider };

export const navigationItemEditor = WrappedComponent => props => (
  <EditingNavigationItemContextConsumer>
    {({ navigationItem, save, cancel, navigationItemChanged }) => (
      <WrappedComponent
        {...props}
        navigationItem={navigationItem}
        saveNavigationItem={save}
        cancelEditingNavigationItem={cancel}
        navigationItemChanged={navigationItemChanged}
      />
    )}
  </EditingNavigationItemContextConsumer>
);

export const navigationItemEditingController = WrappedComponent => withDataContext(
  class extends React.Component {
    static propTypes = {
      setNavigationItemStore: PropTypes.func.isRequired,
      navigationItemStore: PropTypes.shape({
        update: PropTypes.func.isRequired,
        add: PropTypes.func.isRequired,
      }),
    }

    editNavigationItem = (startEditing, navigationItem) => {
      startEditing(
        navigationItem,
        (newItem) => {
          this.props.setNavigationItemStore(
            this.props.navigationItemStore.update(
              newItem.id,
              () => newItem,
            ),
          );
        },
      );
    }

    navigationItemCreated = (createdItem) => {
      this.props.setNavigationItemStore(
        this.props.navigationItemStore.add(createdItem),
      );
    }

    newNavigationLink = (startEditing, navigationSectionId) => {
      startEditing(
        {
          id: null,
          type: 'link',
          navigation_section_id: navigationSectionId,
          title: '',
          page_id: null,
        },
        this.navigationItemCreated,
      );
    }

    newNavigationSection = (startEditing) => {
      startEditing(
        {
          id: null,
          type: 'section',
          title: '',
        },
        this.navigationItemCreated,
      );
    }

    render = () => (
      <EditingNavigationItemContextConsumer>
        {({ startEditing }) => (
          <WrappedComponent
            {...this.props}
            editNavigationItem={
              (navigationItem) => { this.editNavigationItem(startEditing, navigationItem); }
            }
            newNavigationLink={
              (navigationSectionId) => {
                this.newNavigationLink(startEditing, navigationSectionId);
              }
            }
            newNavigationSection={() => { this.newNavigationSection(startEditing); }}
          />
        )}
      </EditingNavigationItemContextConsumer>
    )
  },
);
