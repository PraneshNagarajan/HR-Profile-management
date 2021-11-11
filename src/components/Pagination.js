import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Pagination } from "react-bootstrap";
import { PaginationActions } from "../Redux/PaginationSlice";
import { Fragment } from "react/cjs/react.production.min";

const PageSwitcher = () => {
  const page = useSelector((state) => state.pagination);
  const dispatch = useDispatch();
  const paginationItems = [];
  const begin = page.begin;
  const end = page.end;
  const current = page.current;
  const total = page.total;

  const onCurrentPage = (value) => {
    dispatch(PaginationActions.current({ current: value }));
  };

  const onFirst = () => {
    dispatch(PaginationActions.first());
  };

  const onPrevious = () => {
    dispatch(PaginationActions.previous());
  };

  const onNext = () => {
    dispatch(PaginationActions.next());
  };

  const onLast = () => {
    dispatch(PaginationActions.last());
  };

  for (let i = begin; i <= end; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        className={i === current ? "active" : ""}
        onClick={() => onCurrentPage(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  return (
    <Fragment>
      {total > 0 && (
        <Pagination>
          <Pagination.Item
            disabled={current === 1 ? true : false}
            onClick={() => onFirst(1)}
          >
            {"<<"}
          </Pagination.Item>
          <Pagination.Item
            disabled={current === 1 ? true : false}
            onClick={() => onPrevious(current - 1)}
          >
            {"<"}
          </Pagination.Item>
          {paginationItems}
          <Pagination.Item
            disabled={total === end && end === current ? true : false}
            onClick={() => onNext(current + 1)}
          >
            {">"}
          </Pagination.Item>
          <Pagination.Item
            disabled={total === end && end === current ? true : false}
            onClick={() => onLast(total)}
          >
            {">>"}
          </Pagination.Item>
        </Pagination>
      )}
    </Fragment>
  );
};
export default PageSwitcher;
