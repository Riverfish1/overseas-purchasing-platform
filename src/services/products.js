import request from '../utils/request';
import { PAGE_SIZE } from '../constants';

export function queryProductTable({ page }) {
  return request(`/mock/products?page=${page}&_limit=${PAGE_SIZE}`);
}

