const leadsModel = ({ api, utils, config, constants, models }: any) => {
  const { log, query, getHealth } = utils;

  const { DEFAULT_BASE_PAGE, DEFAULT_PAGE_SIZE, SUPPORTED_PAGE_SIZES } =
    constants;

  /*
   * Set current page.
   * @params {string|number} page - Page.
   * @returns {number} Returns page number.
   */
  const _setCurrentPage = (page: string | number, size: string | number) => {
    const res: number = DEFAULT_BASE_PAGE;

    const [parsedPage, parsedSize] = [
      Math.abs(Number(page) || DEFAULT_BASE_PAGE),
      Math.abs(Number(size) || DEFAULT_PAGE_SIZE)
    ];

    const factor: number =
      parsedPage > DEFAULT_BASE_PAGE ? parsedSize : DEFAULT_BASE_PAGE;

    return parsedPage * factor;
  };

  /*
   * Format lead data.
   * @params {array} elts - Leads data.
   * @returns {array} Returns lead data.
   */
  const _formatLeadData = (payload: any = {}) => ({
    id: payload?.id,
    www: payload?.www,
    name: payload?.name,
    phone: payload?.phone,
    rating: payload?.rating,
    status: payload?.status,
    // task_id: payload?.task_id,
    reviews: payload?.reviews,
    address: payload?.address,
    category: payload?.category,
    date_created: payload?.date_created,
    emails: payload?.emails ? payload?.emails?.split(",") : []
  });

  /*
   * Get lead info by symbol.
   * @params {string} symbol- Lead symbol.
   * @returns {array} Returns leads.
   */
  const get = async (id: string = "") => {
    try {
      const res = await query(
        `SELECT t0.*, l0.*, STRING_AGG(l1.email, ', ') AS emails ` +
          `FROM tasks AS t0 ` +
          `LEFT JOIN leads AS l0 ON l0.task_id = t0.id ` +
          `LEFT JOIN lead_emails AS l1 ON l1.lead_id = l0.id ` +
          `WHERE t0.status = 1 AND t0.id = $1 ` +
          `GROUP BY t0.id, l0.id;`,
        [id]
      );

      return res.map(_formatLeadData);
    } catch (e) {
      log.error("Error while fetching lead by id.");

      // throw new Error("while getting lead by id.");
    }
  };

  return Object.freeze({
    get,
    getHealth
  });
};

export default leadsModel;
