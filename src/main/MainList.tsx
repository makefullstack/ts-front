import * as React from "react";
import "antd/dist/antd.css";
import "./list.css";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "..";
import { selectMenuAction } from "../reducer/menu";
import { humorRequestActions, ISiteDataGroup } from "../reducer/request";
import { Button, List } from "antd";
import Avatar from "antd/lib/avatar/avatar";
import { ISiteInitMetaDataRaw } from "../saga/request";

const MainList = ({ selectedKey }: { selectedKey: string }): JSX.Element => {
  const dispatch = useDispatch();
  const {
    [selectedKey]: { isMoreLoad, lists, state, polling },
  } = useSelector<ReducerType, ISiteDataGroup>((state) => state.humorRequestReducer);
  const initData = useSelector<ReducerType, ISiteInitMetaDataRaw[]>((state) => state.initialReducer.data[1]);
  const needInitLoad = React.useMemo(() => lists.length === 0, [lists.length]);

  interface meta {
    [attrName: string]: {
      name: string;
      iconUrl: string;
    };
  }

  const siteMetaData = React.useMemo((): meta => {
    return initData.reduce((prev, cur): meta => {
      return {
        ...prev,
        [cur.attrName]: {
          iconUrl: cur.iconUrl,
          name: cur.name,
        },
      };
    }, {});
  }, []);

  const onLoadData = React.useCallback(() => {
    if (state.load || !isMoreLoad) return;
    const lastId = lists[lists.length - 1]?.id;
    dispatch(humorRequestActions.request({ lastId, selectedKey }));
  }, [selectedKey, lists, state.load, isMoreLoad]);

  React.useEffect(() => {
    if (needInitLoad) {
      dispatch(humorRequestActions.request({ selectedKey }));
    } else if (!polling.load) {
      dispatch(humorRequestActions.pollingRequest({ recentId: lists[0].id, selectedKey }));
    }
  }, [selectedKey, needInitLoad, polling.load, lists]);

  React.useEffect(() => {
    function onScroll() {
      if (window.pageYOffset + document.documentElement.clientHeight > document.documentElement.scrollHeight - 100) {
        onLoadData();
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [selectedKey, state, isMoreLoad, lists]);

  const loadMore = React.useMemo(
    () =>
      !needInitLoad && !state.load && isMoreLoad ? (
        <div
          style={{
            textAlign: "center",
            marginTop: 12,
            height: 32,
            lineHeight: "32px",
          }}
        >
          <Button onClick={onLoadData}>loading more</Button>
        </div>
      ) : null,
    [selectedKey, needInitLoad, state.load, isMoreLoad],
  );

  return (
    <List
      itemLayout="horizontal"
      loading={lists.length === 0}
      dataSource={lists}
      loadMore={loadMore}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <List.Item.Meta
            className="itemMeta"
            avatar={<Avatar src={siteMetaData[item.site || selectedKey].iconUrl} />}
            title={
              <button
                onClick={() => {
                  dispatch(selectMenuAction(item.site || selectedKey));
                }}
              >
                <span> {siteMetaData[item.site || selectedKey].name} </span>
              </button>
            }
            description={
              <a style={{ color: "slategray" }} href={item.url} rel="noreferrer" target="_blank">
                {item.title}
              </a>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default MainList;
